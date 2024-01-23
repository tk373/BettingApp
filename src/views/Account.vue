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
        <ion-alert
          v-model:is-open="showAlert"
          header="Complete Your Profile"
          :inputs="inputs"
          :buttons="alertButtons">
        </ion-alert>
        <div v-if="userInfo.username && userInfo.firstname && userInfo.lastname && userInfo.address">
          <p>Username: {{ userInfo.username }}</p>
          <p>Firstname: {{ userInfo.firstname }}</p>
          <p>Lastname: {{ userInfo.lastname }}</p>
          <p>Address: {{ userInfo.address }}</p>
        </div>
    </ion-content>
    </ion-content>
    
  </ion-page>
</template>

<script setup lang="ts">
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../useauth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAlert, IonButton, IonButtons } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { ref, watchEffect } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import router from '@/router';

const showAlert = ref(false);
const { user } = useAuth();

interface User {
  amount: number
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  address: string | null;
}

const userInfo = ref<User>({
  amount: 0, // Default amount set during registration
  username: null,
  firstname: null,
  lastname: null,
  address: null
});


interface AlertInputData {
  username: string;
  firstname: string;
  lastname: string;
  address: string;
}

const inputs = [
  { name: 'username', type: 'text', placeholder: 'Username' },
  { name: 'firstname', type: 'text', placeholder: 'Firstname' },
  { name: 'lastname', type: 'text', placeholder: 'Lastname' },
  { name: 'address', type: 'text', placeholder: 'Address' }
];

const alertButtons = [
  {
    text: 'Cancel',
    role: 'cancel',
    handler: () => {
      showAlert.value = false;
    }
  },
  {
    text: 'Save',
    handler: async (data: AlertInputData) => {
      // Update userInfo with the new data
      userInfo.value = {
        amount: 100,
        username: data.username || null,
        firstname: data.firstname || null,
        lastname: data.lastname || null,
        address: data.address || null
      };
      if (user.value) {
        await setDoc(doc(db, 'users', user.value.uid), userInfo.value);
      }
      showAlert.value = false;
    }
  }
];

const fetchUserInfo = async () => {
  if (user.value) {
    const docRef = doc(db, 'users', user.value.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as User;
      console.log(data);

      // Check if any of the required fields are missing or empty
      const isProfileIncomplete = !data.username || !data.firstname || !data.lastname || !data.address;

      if (isProfileIncomplete) {
        // Show the alert if any field is missing
        showAlert.value = true;
      } else {
        // Update userInfo with the fetched data
        userInfo.value = data;
        console.log(userInfo.value);
      }
    } else {
      // If the document does not exist, show the alert to enter information
      showAlert.value = true;
    }
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login'); // Redirect to login page after logout
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
