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
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="password" type="password"></ion-input>
          </ion-item>
          <ion-button expand="full" type="submit">Register</ion-button>
          <ion-button expand="full" @click="goToLogin">Already have an account? Login</ion-button>
        </form>
        <div v-if="error">{{ error }}</div>
      </ion-content>
    </ion-page>
  </template>
  

  <script setup lang="ts">
  import { ref } from 'vue';
  import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
  import { auth, db } from '@/firebaseConfig'; // Adjust the path as needed
  import { useRouter } from 'vue-router';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';

    const email = ref<string>('');
    const password = ref<string>('');
    const error = ref<string>('');
    const router = useRouter();

    const register = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        router.push({ name: 'home' }); 
      } catch (err) {
        console.log(err);
      }
      return { email, password, error, register, goToLogin };
    };

    const goToLogin = () => {
      router.push('/login'); 
    };
  </script>