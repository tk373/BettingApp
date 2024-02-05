<template>
     <ion-list class="game-list">
       <template v-for="(games, date) in sortedGames">
      <ion-item-divider>
        <ion-label>{{ new Date(date).toLocaleDateString() }}</ion-label>
      </ion-item-divider>
      <ion-item v-for="game in games" :key="game.id" class="game-item">
        <div class="team home-team">
            <img :src="logoUrl(game.home_team)" class="team-icon" alt="Home Team Logo" /> 
          {{ game.home_team }}
          <button class="odds-button" 
                  :class="{ 'clicked': selectedTeams[game.id] === 'home' }" 
                  @click="selectTeam(game.id, 'home')"> 
            {{ findOdds(game.bookmakers, game.home_team) }}
          </button>
        </div>

        <div class="commence-time">
          {{ formatGameTime(game.commence_time) }}
        </div>

        <div class="team away-team">
            <button class="odds-button" 
                  :class="{ 'clicked': selectedTeams[game.id] === 'away' }" 
                  @click="selectTeam(game.id, 'away')">
            {{ findOdds(game.bookmakers, game.away_team) }}
          </button>
          <img :src="logoUrl(game.away_team)" class="team-icon" alt="Away Team Logo" />
          {{ game.away_team }}
        </div>
      </ion-item>
    </template>
  </ion-list>
  <BettingSlip :selectedBets="selectedTeams" />

  <div v-if="selectedBetsCount > 0" class="betting-slip-bar">
    Betting Slip
    <span class="bets-count">{{ selectedBetsCount }}</span>
  </div>
  </template>

<script lang="ts" setup>
import { IonList, IonItem, IonItemDivider, IonLabel } from '@ionic/vue';
import { Ref, computed, onMounted, ref } from 'vue';
import { formatGameTime, findOdds, checkAndLoadData, sortedGames } from '../dataCollection';
import { SelectedTeams } from '@/types';
import BettingSlip from './BettingSlip.vue';

const selectedTeams: Ref<SelectedTeams> = ref({} as SelectedTeams);

onMounted(async () => {
    await checkAndLoadData().catch(error => {
        console.error('Error during initial data load:', error);
    });
    const savedSelections = localStorage.getItem('selectedTeams');
  if (savedSelections) {
    // Merge saved selections with the existing state to preserve reactivity
    Object.assign(selectedTeams.value, JSON.parse(savedSelections));
  }
});

const hasSelectedBets = computed(() => {
  return Object.keys(selectedTeams.value).length > 0;
});
const selectedBetsCount = computed(() => {
  return Object.keys(selectedTeams.value).length;
});

const logoUrl = (teamName: string) => {
  const formattedName = teamName.replace(/\s+/g, '-').toLowerCase();
  return `/${formattedName}-logo@logotyp.us.svg`; 
};

const selectTeam = (gameId: string, team: 'home' | 'away') => {
  if (selectedTeams.value[gameId] === team) {
    // If the team is already selected, unselect it
    delete selectedTeams.value[gameId];
  } else {
    // Otherwise, select the team
    selectedTeams.value[gameId] = team;
  }
  // Save the updated selectedTeams to localStorage
  localStorage.setItem('selectedTeams', JSON.stringify(selectedTeams.value));
};

</script>

<style scoped>
.betting-slip-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: blue;
  color: white;
  text-align: center;
  padding: 10px 0;
  font-size: 18px;
  z-index: 100; /* Ensure it's above other content */
}

.bets-count {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: blue;
  border-radius: 50%;
  width: 24px; /* Equal width and height */
  height: 24px; /* Equal width and height */
  font-size: 14px;
  margin-left: 10px;
  vertical-align: middle;
}
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
  padding: 3px;
  position: relative; 
  margin: 0;
}

.team {
  flex-basis: 40%; /* Adjust as needed */
}

.commence-time {
  flex-basis: 20%; /* Adjust as needed */
  text-align: center;
}

.odds-label {
  margin: 0 2px;
  font-weight: bold;
}

.team-icon {
  height: 80px; /* Adjust the height as needed */
  width: 80px; /* Adjust the width as needed */
  object-fit: contain; /* Maintains the image aspect ratio */
  position: absolute; /* Positions the logo absolutely within the game-item */
  top: 50%; /* Aligns the top of the icon at the center of the container */
  transform: translateY(-50%); /* Centers the icon vertically */
}

.home-team {
    text-align: left;
  padding-left: 8vw; /* Space for the icon plus some padding */
}

.away-team {
    text-align: right;
  padding-right: 8vw; /* Space for the icon plus some padding */
}

.home-team .team-icon {
  left: 0px; /* Adjust as needed, based on the size of the icon */
}

.away-team .team-icon {
  right: 0px; /* Adjust as needed, based on the size of the icon */
}
.odds-button {
    background-color: black ;
    border: none;
    color: inherit; /* Inherit font color from parent */
    cursor: pointer;
    font-weight: bold;
    padding: 5px 10px;
    margin: 0 5px;
    border-radius: 4px;
  }

  .clicked {
    background-color: blue; /* Change color to blue when clicked */
  }
</style>