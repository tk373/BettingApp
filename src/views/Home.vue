<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <!-- ... existing content ... -->
      <ExploreContainer name="home page" />

      <!-- Grouped List of Games with Ionic Components -->
      <ion-list>
        <template v-for="(games, date) in sortedGames">
          <ion-item-divider>
            <ion-label>{{ new Date(date).toLocaleDateString() }}</ion-label>
          </ion-item-divider>
          <ion-item v-for="game in games" :key="game.id">
            <ion-label class="ion-text-start">{{ game.home_team }}</ion-label>
            <ion-label class="ion-text-center">{{ new Date(game.commence_time).toLocaleTimeString() }}</ion-label>
            <ion-label class="ion-text-end">{{ game.away_team }}</ion-label>
          </ion-item>
        </template>
      </ion-list>

      <div v-if="error">{{ error }}</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { computed, onMounted, ref } from 'vue';
import { openDB } from 'idb';

type Game = {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
};

type GamesByDate = {
  [date: string]: Game[];
};

const apiData = ref<Game[]>([]);
const error = ref<string>('');
const CACHE_DURATION = 86400000; // Cache duration in milliseconds (24 hours)

const dbName = 'nhlOddsDB';
const storeName = 'nhlOddsStore';


const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(storeName);
  },
});

const fetchData = async () => {
  const url = 'https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=cf45597e4178a79932a6525041300585&regions=us&markets=h2h,spreads&oddsFormat=decimal';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    apiData.value = data;

    // Save data and timestamp in IndexedDB
    const db = await dbPromise;
    db.put(storeName, data, 'data');
    db.put(storeName, Date.now(), 'timestamp');
  } catch (err) {
    console.log(err);
  }
};

const checkAndLoadData = async () => {
  const db = await dbPromise;
  const timestamp = await db.get(storeName, 'timestamp');

  if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
    apiData.value = await db.get(storeName, 'data');
  } else {
    await fetchData();
  }
};

const processGames = (games: Game[]): GamesByDate => {
  const gamesByDate = games.reduce((acc: GamesByDate, game: Game) => {
    const date = game.commence_time.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});

  // Sort each group of games by time
  for (const date in gamesByDate) {
    gamesByDate[date].sort((a, b) => a.commence_time.localeCompare(b.commence_time));
  }

  return gamesByDate;
};

const sortedGames = computed<GamesByDate>(() => processGames(apiData.value));

onMounted(checkAndLoadData);
</script>

<style>
.game-list {
  list-style-type: none;
  padding: 0;
}

.game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.team {
  flex-basis: 45%; /* Adjust the width of each team's name container */
}

.home-team {
  text-align: left;
}

.away-team {
  text-align: right;
}
</style>