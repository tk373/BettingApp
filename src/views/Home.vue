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
          <ion-label>
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
      
      <GameList />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButtons } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { auth } from '@/firebaseConfig';
import GameList from './Gamelist.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchAccountBalance, accountBalance, isLoading } from '../dataCollection';

onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchAccountBalance(user.uid);
  }
});

</script>

<style>

</style>