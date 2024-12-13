<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Register</ion-title>
        </ion-toolbar>
        </ion-header>
      <ion-content :fullscreen="true">
        <form @submit.prevent="register">
          <ion-item>
            <ion-input label="Email" label-placement="floating" v-model="email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Password" label-placement="floating" v-model="password" type="password"></ion-input>
          </ion-item>
          <ion-button expand="full" type="submit">Register</ion-button>
        </form>
        <ion-item>
          <label>Already have an Account? </label>
          <ion-button @click="goToLogin" fill="clear" color="primary">Login here</ion-button>
         </ion-item>
        <div v-if="error">{{ error }}</div>
      </ion-content>
    </ion-page>
  </template>
  

  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { auth } from '@/firebaseConfig'; // Adjust the path as needed
  import { useRouter } from 'vue-router';
  import { createUserWithEmailAndPassword } from 'firebase/auth';

    const email = ref<string>('');
    const password = ref<string>('');
    const error = ref<string>('');
    const router = useRouter();

    const register = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        router.push({ name: 'account' }); 
      } catch (err) {
        console.log(err);
      }
      return { email, password, error, register, goToLogin };
    };

    const goToLogin = () => {
      router.push('/login'); 
    };
  </script>