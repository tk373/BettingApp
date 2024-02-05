<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
     <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <form @submit.prevent="handleLogin">
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" required type="email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input v-model="password" required type="password"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" class="ion-margin-top">Login</ion-button>
        
      </form>
      <ion-item>
          <ion-label>Don't have an Account yet? </ion-label>
          <ion-button @click="goToRegister" fill="clear" color="primary">Register here</ion-button>
         </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonGrid, IonCol, IonRow } from '@ionic/vue';
import { auth } from '../firebaseConfig'; // Adjust the path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import router from '@/router';


    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('Logged in successfully!');
        router.push({ name: 'home' });
      } catch (error) {
        console.error('Login failed:');
        // Handle errors
      }
    return {
      email,
      password,
      handleLogin,
      goToRegister
    };
  }
  const goToRegister = () => {
    router.push('/register');
    };
</script>


<style>
.login-form {
  max-width: 400px;
  margin: auto;
}

ion-item {
  margin-bottom: 20px;
}

ion-button {
  --background: #3880ff;
  --background-activated: #3171e0;
  --background-focused: #3171e0;
  --background-hover: #4c8dff;
  --color: white;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .login-form {
    margin: 20px;
  }
}
</style>
