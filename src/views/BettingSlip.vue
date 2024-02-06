<template>
  <div class="betting-slip">
    <div class="betting-slip-header">
      <h2>Betting Slip</h2>
    <ion-button fill="clear" class="close-button" @click="deleteBettingSlip">
      <ion-icon aria-hidden="true" :icon="trashOutline"></ion-icon>
    </ion-button>
    <ion-button fill="clear" class="delete-button" @click="closeBettingSlip">
      <ion-icon aria-hidden="true" :icon="closeOutline"></ion-icon>
    </ion-button>
  </div>
  <div class="betting-slip-content">
    <div v-for="game in filteredGames" :key="game.id" class="game-box">
        <p>{{ game.home_team }} - {{ game.away_team }}</p>
        <p>3-Way</p>
        <p>
          <strong>{{ selectedTeams[game.id] === 'home' ? game.home_team : game.away_team }}</strong>
        </p>
        <p>{{ findOdds(game.bookmakers, selectedTeams[game.id] === 'home' ? game.home_team : game.away_team) }}</p>
      </div>
      <div class="stake-input">
        <ion-item>
        <ion-label for="stake">Stake:</ion-label>
        <ion-input type="number" id="stake" v-model="stakeAmount" placeholder="Enter your stake"/>
        </ion-item>
      </div>
      <div class="potential-winnings">
        <p>Total Odds: {{ totalOdds.toFixed(2) }}</p>
        <p>Possible Winnings: ${{ possibleWinnings.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
    import { IonButton, IonIcon, IonInput, IonLabel, IonItem } from '@ionic/vue';
    import { apiData, calculateTotalOdds, filterSortedGames, selectedTeams } from '../dataCollection';
    import { findOdds, showBettingSlip } from '../dataCollection';
    import { closeOutline, trashOutline } from 'ionicons/icons';
    import { SelectedTeams } from '@/types';
    import { computed, ref } from 'vue';

    const JsonString = String(localStorage.getItem('selectedTeams'));
    const filteredGames = filterSortedGames(apiData, JsonString);
    const stakeAmount = ref(0);

    const totalOdds = calculateTotalOdds(filteredGames.value, selectedTeams.value);

    const possibleWinnings = computed(() => {
    return stakeAmount.value * totalOdds;
    });


    function closeBettingSlip() {
      showBettingSlip.value = false; // Toggle the global state to hide the betting slip
    }

    function deleteBettingSlip() {
      localStorage.clear();
      selectedTeams.value = {} as SelectedTeams;
      showBettingSlip.value = false;
    }

  </script>
  
  <style>
  .betting-slip {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.game-box {
  background-color: inherit;
  padding: 20px; /* Increased padding for more internal space */
  margin-bottom: 20px; /* Increased margin for more space between bets */
  border-radius: 10px; /* Slightly larger radius for a softer look */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Soft shadow for depth */
  border: 1px solid #d1d1d1; /* Subtle border for definition */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transition for interaction */
}
.betting-slip-content {
  padding: 10px 0; /* Adjusted padding for top and bottom spacing */
}

.game-box:hover {
  transform: translateY(-5px); /* Slight raise effect on hover */
  box-shadow: 0 4px 8px rgba(0,0,0,0.2); /* Enhanced shadow on hover for emphasis */
}

.betting-slip-header {
  padding: 20px;
  background-color: inherit;
  display: flex;
  align-items: center;
}

.betting-slip-content {
  padding: 20px;
}

.close-button {
  margin-left: auto;
}

.delete-button{
  justify-content: right;
}
  </style>