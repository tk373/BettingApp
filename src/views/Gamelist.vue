<template>
     <ion-list class="game-list">
       <template v-for="(games, date) in sortedGames">
      <ion-item-divider>
        <ion-label>{{ new Date(date).toLocaleDateString() }}</ion-label>
      </ion-item-divider>
      <ion-item v-for="game in games" :key="game.id" class="game-item">
        <div class="team home-team">
          {{ game.home_team }}
          <span class="odds-label">{{ findOdds(game.bookmakers, game.home_team) }}</span>
        </div>

        <div class="commence-time">
          {{ formatGameTime(game.commence_time) }}
        </div>

        <div class="team away-team">
          <span class="odds-label">{{ findOdds(game.bookmakers, game.away_team) }}</span>
          {{ game.away_team }}
        </div>
      </ion-item>
    </template>
  </ion-list>
  </template>

<script lang="ts" setup>
import { IonList, IonItem, IonItemDivider, IonLabel } from '@ionic/vue';
import { onMounted } from 'vue';
import { formatGameTime, findOdds, checkAndLoadData, sortedGames } from '../dataCollection';

onMounted(async () => {
    await checkAndLoadData().catch(error => {
        console.error('Error during initial data load:', error);
    });
});

</script>

<style scoped>
.ion-list {
  padding-top: 0;
}

.game-list {
  list-style-type: none;
  padding: 0;
}

.game-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.team {
  flex-basis: 40%; /* Adjust as needed */
}

.home-team {
  text-align: left;
}

.away-team {
  text-align: right;
}

.commence-time {
  flex-basis: 20%; /* Adjust as needed */
  text-align: center;
}

.odds-label {
  margin: 0 2px;
  font-weight: bold;
}
</style>