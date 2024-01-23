import { onUnmounted, ref } from 'vue';
import { auth } from '@/firebaseConfig'; // Adjust path as needed
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
  const user = ref<User | null>(null);
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
  });

  onUnmounted(unsubscribe); // Clean up the subscription when the component is unmounted

  return { user };
}