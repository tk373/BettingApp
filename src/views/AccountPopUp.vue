<template>
    <ion-alert
          v-model:is-open="showAlert"
          header="Complete Your Profile"
          :inputs="inputs"
          :buttons="alertButtons"
          :backdropDismiss="false">
        </ion-alert>
        <ion-alert
          v-model:is-open="showvalidationAlert"
          header="Validation Error"
          message="ENTER VALID DATA MF"
          @didDismiss="handleAlertDismissed">
        </ion-alert>
</template>

<script lang="ts" setup>
import { db } from '@/firebaseConfig';
import { AlertInputData } from '@/types';
import { useAuth } from '@/useauth';
import { IonAlert } from '@ionic/vue';
import { doc, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { fetchUserInfo, showAlert, user } from '@/dataCollection';

const showvalidationAlert = ref(false);


const inputs = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Username',
    value: '', // Initial value
  },
  {
    name: 'firstname',
    type: 'text',
    placeholder: 'First Name',
    value: '', // Initial value
  },
  {
    name: 'lastname',
    type: 'text',
    placeholder: 'Last Name',
    value: '', // Initial value
  },
  {
    name: 'address',
    type: 'text',
    placeholder: 'Address',
    value: '', // Initial value
  },
];

const alertButtons = [
  {
    text: 'Save',
    handler: async (data: AlertInputData) => {

      let usernameValue = data.username;
      let firstnameValue = data.firstname;
      let lastnameValue = data.lastname;
      let addressValue = data.address;

      if (usernameValue && firstnameValue && lastnameValue && addressValue) {

        showAlert.value = false;

        const userInfo = {
          amount: 100,
          username: usernameValue || null,
          firstname: firstnameValue || null,
          lastname: lastnameValue || null,
          address: addressValue || null,
        };

        // If a user is authenticated, update the user info in Firestore
        if (user.value) {
          const userDocRef = doc(db, 'users', user.value.uid);

          try {
            await setDoc(userDocRef, userInfo);
            console.log('User info saved successfully:', userInfo);
            fetchUserInfo();
          } catch (error) {
            console.error('Error saving user info:', error);
          }
        } else {
          console.error('User is not authenticated. Cannot save user info.');
        }
      } else {
        console.error('Validation error: All fields must be filled out');
        showvalidationAlert.value = true;
        return false;
      }
    },
  },
];

const handleAlertDismissed = () => {
  showvalidationAlert.value = false;
  console.log(showvalidationAlert.value)
};
</script>