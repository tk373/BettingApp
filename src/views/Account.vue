<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            Logout
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Account</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div v-if="isLoading" class="center-spinner">
           <ion-spinner name="crescent"></ion-spinner>
         </div>
       <account-pop-up></account-pop-up>
        <div v-if="userInfo.firstname && userInfo.lastname && userInfo.address && userInfo.username">
    <!-- Use ion-card for better styling in Ionic -->
    <ion-card>
      <ion-card-content>
        <!-- Use a list to display the information as it appears in the screenshot -->
        <ion-list lines="none">
          <ion-item>
            <ion-input label="First Name" label-placement="stacked" readonly :value="userInfo.firstname"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Last Name" label-placement="stacked" readonly :value="userInfo.lastname"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Username" label-placement="stacked" readonly :value="userInfo.username"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Amount" label-placement="stacked" readonly :value="'$' + userInfo.amount"></ion-input>
          </ion-item>
        </ion-list>
      </ion-card-content>
    </ion-card>
  </div>
    </ion-content>
    </ion-content>
    
  </ion-page>
</template>

<script setup lang="ts">
import { IonSpinner, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAlert, IonButton, IonButtons, IonCardContent, IonCard, IonList, IonItem, IonLabel, IonInput } from '@ionic/vue';
import { watchEffect } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import router from '@/router';
import { userInfo  } from '@/types';
import AccountPopUp from './AccountPopUp.vue';
import { fetchUserInfo, showAlert, user, isLoading } from '@/dataCollection';


const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login'); 
  } catch (error) {
    console.error('Logout failed:', error);
    // Handle logout error (e.g., show a message to the user)
  }
};

watchEffect(async () => {
  if (user.value) {
    await fetchUserInfo();
  }
});

</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  align-items: center;
  justify-items: center;
  height: 100%;
}

.grid-item {
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f4f4f4;
}
.center-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
