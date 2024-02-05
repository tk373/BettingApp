import { computed, ref } from 'vue';
import { openDB } from 'idb';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Game, GamesByDate, User, userInfo } from './types'; // Define your types here
import { useAuth } from './useauth';

const CACHE_DURATION = 86400000; // 24 hours

const apiData = ref<Game[]>([]);
const sortedGames = computed<GamesByDate>(() => processGames(apiData.value));
const accountBalance = ref(0);
const { user } = useAuth();
const isLoading = ref(true);
const showAlert = ref(false);

const dbName = 'nhlOddsDB';
const storeName = 'nhlOddsStore';


const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(storeName);
  },
});

const fetchData = async () => {
  const url = 'https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=cf45597e4178a79932a6525041300585&regions=us&markets=h2h,spreads&oddsFormat=decimal';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    apiData.value = data;

    const db = await dbPromise;
    db.put(storeName, data, 'data');
    db.put(storeName, Date.now(), 'timestamp');
  } catch (err) {
    console.log(err);
  }
};

const checkAndLoadData = async () => {
    const db = await dbPromise;
    const timestamp = await db.get(storeName, 'timestamp');
  
    if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
      apiData.value = await db.get(storeName, 'data');
    } else {
      await fetchData();
    }
  };
  
  const processGames = (games: Game[]): GamesByDate => {
    const gamesByDate = games.reduce((acc: GamesByDate, game: Game) => {
      const date = game.commence_time.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(game);
      return acc;
    }, {});
    for (const date in gamesByDate) {
      gamesByDate[date].sort((a, b) => a.commence_time.localeCompare(b.commence_time));
    }
    return gamesByDate;
  };
  
  const formatGameTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  };
  

  

  
  const findOdds = (bookmakers: any, teamName: any) => {
    for (const bookmaker of bookmakers) {
      for (const market of bookmaker.markets) {
        if (market.key === 'h2h') {
          const outcome = market.outcomes.find((outcome: { name: any; }) => outcome.name === teamName);
          if (outcome) {
            return outcome.price;
          }
        }
      }
    }
    return 'Odds not available';
  };
  
  const fetchAccountBalance = async (userId: string) => {
    isLoading.value = true;
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        accountBalance.value = userData.amount;
        isLoading.value = false;
      }
    } catch (error) {
      console.error('Error fetching account balance:', error);
      // Handle error (e.g., show a message to the user)
      fetchAccountBalance(String(user.value?.uid));
    }
  };

  const fetchUserInfo = async () => {
    isLoading.value = true;
    if (user.value) {
      const docRef = doc(db, 'users', user.value.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
  
        const isProfileIncomplete = !data.username || !data.firstname || !data.lastname || !data.address;
  
        if (isProfileIncomplete) {
          // Show the alert if any field is missing
          showAlert.value = true;
          console.log("false");
        } else {
          // Update userInfo with the fetched data
          isLoading.value = false;
          userInfo.value = data;
        }
      } else {
        // If the document does not exist, show the alert to enter information
        isLoading.value = false;
        showAlert.value = true;
      }
    }
  };

  export { fetchUserInfo, fetchData, checkAndLoadData, processGames, findOdds, fetchAccountBalance, formatGameTime, apiData, sortedGames, accountBalance, isLoading, showAlert, user};