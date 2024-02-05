<template>
   <div class="betting-slip">
    <h2>Betting Slip</h2>
    <ul>
      <li v-for="(bet, gameId) in selectedBets" :key="gameId">
        
        <strong>2-Way</strong>
        <br>
        *{{ bet.team }}* @ {{ bet.odds }}
      </li>
    </ul>
  </div> 
</template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
    
  const props = defineProps({
    selectedBets: Object,
    gamesMap: Object // Assuming you pass a map of games by their ID for easy lookup {{ gamesMap[gameId].home_team }} - {{ gamesMap[gameId].away_team }}:
    });
  </script>
  
  <style>
  
  </style>