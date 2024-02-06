<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <div v-if="isLoading" class="center-spinner">
           <ion-spinner name="crescent"></ion-spinner>
         </div>
          <div v-if="isLoading == false">
          <ion-label class="balance">
            Balance: ${{ accountBalance }}
          </ion-label>
        </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <template v-if="!showBettingSlip">
      <GameList />
    </template>
    <betting-slip v-if="showBettingSlip" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButtons } from '@ionic/vue';
import { auth } from '@/firebaseConfig';
import GameList from './Gamelist.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchAccountBalance, accountBalance, isLoading, showBettingSlip } from '../dataCollection';
import BettingSlip from './BettingSlip.vue';

onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchAccountBalance(user.uid);
  }
});

</script>

<style>
.balance{
  padding-right: 10px;
}
</style>