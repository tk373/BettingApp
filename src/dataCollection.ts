import { Ref, computed, ref } from "vue";
import { openDB } from "idb";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Game, GamesByDate, SelectedTeams, User, userInfo } from "./types";
import { useAuth } from "./useauth";

const CACHE_DURATION = 86400000; // 24 hours

const apiData = ref<Game[]>([]);
const sortedGames = computed<GamesByDate>(() => processGames(apiData.value));
const accountBalance = ref(0);
const { user } = useAuth();
const isLoading = ref(true);
const showAlert = ref(false);
const showBettingSlip = ref(false);
const selectedTeams: Ref<SelectedTeams> = ref({} as SelectedTeams);

const dbName = "nhlOddsDB";
const storeName = "nhlOddsStore";
const apikeyNHL = import.meta.env.VITE_NHL_API_KEY;

const dbPromise = openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(storeName);
  },
});

const fetchData = async () => {
  const url = `https://api.the-odds-api.com/v4/sports/icehockey_nhl/odds/?apiKey=${apikeyNHL}&regions=us&markets=h2h,spreads&oddsFormat=decimal`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    apiData.value = data;

    const db = await dbPromise;
    db.put(storeName, data, "data");
    db.put(storeName, Date.now(), "timestamp");
  } catch (err) {
    console.log(err);
  }
};

const checkAndLoadData = async () => {
  const db = await dbPromise;
  const timestamp = await db.get(storeName, "timestamp");

  if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
    apiData.value = await db.get(storeName, "data");
  } else {
    await fetchData();
  }
};

const processGames = (games: Game[]): GamesByDate => {
  const gamesByDate = games.reduce((acc: GamesByDate, game: Game) => {
    const date = game.commence_time.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});
  for (const date in gamesByDate) {
    gamesByDate[date].sort((a, b) =>
      a.commence_time.localeCompare(b.commence_time)
    );
  }
  return gamesByDate;
};

const formatGameTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const calculateTotalOdds = (games: Game[], teams: SelectedTeams): number => {
  let totalOdds = 1;
  games.forEach((game) => {
    const teamSelection = teams[game.id]; // 'home' or 'away'
    if (teamSelection) {
      // Find the 'h2h' market for this game
      const h2hMarket = game.bookmakers
        .flatMap((bookmaker) => bookmaker.markets)
        .find((market) => market.key === "h2h");

      if (h2hMarket) {
        // Determine the team's name based on the selection
        const teamName =
          teamSelection === "home" ? game.home_team : game.away_team;

        // Find the outcome for the selected team
        const outcome = h2hMarket.outcomes.find(
          (outcome) => outcome.name === teamName
        );

        if (outcome) {
          totalOdds *= outcome.price; // Multiply the odds together
        }
      }
    }
  });

  return totalOdds;
};

const findOdds = (bookmakers: any, teamName: any) => {
  for (const bookmaker of bookmakers) {
    for (const market of bookmaker.markets) {
      if (market.key === "h2h") {
        const outcome = market.outcomes.find(
          (outcome: { name: any }) => outcome.name === teamName
        );
        if (outcome) {
          return outcome.price;
        }
      }
    }
  }
  return "Odds not available";
};

const fetchAccountBalance = async (userId: string) => {
  isLoading.value = true;
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      accountBalance.value = userData.amount;
      isLoading.value = false;
    }
  } catch (error) {
    console.error("Error fetching account balance:", error);
    // Handle error (e.g., show a message to the user)
    fetchAccountBalance(String(user.value?.uid));
  }
};

const placeBetAndUpdateBalance = async (userId: string, betAmount: number) => {
  try {
    // Fetch the current account balance
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const currentBalance = userData.amount;

      // Calculate the new balance by subtracting the bet amount
      const newBalance = currentBalance - betAmount;

      // Check if the new balance is not negative
      if (newBalance >= 0) {
        // Update the user's document with the new balance
        await updateDoc(userDocRef, {
          amount: newBalance,
        });
        // Optionally, add logic to record the bet in another collection/document here
        console.log("Account balance updated successfully");
        fetchAccountBalance(userId);
      } else {
        // Handle case where user does not have enough balance
        console.error("Not enough balance to place bet");
      }
    } else {
      console.error("User document does not exist");
    }
  } catch (error) {
    console.error("Error updating account balance:", error);
  } finally {
    isLoading.value = false;
  }
};

const filterSortedGames = (
  sortedGames: Ref<Game[]>,
  selectedTeamsJSON: string
): Ref<Game[]> => {
  const selectedTeams: SelectedTeams = JSON.parse(selectedTeamsJSON); // Parse the selected teams from localStorage
  const filteredGames = ref<Game[]>([]);

  filteredGames.value = sortedGames.value.filter((game) => {
    // Check if the game's ID is in the selectedTeams object
    return Object.keys(selectedTeams).includes(game.id);
  });

  return filteredGames;
};

const fetchUserInfo = async () => {
  isLoading.value = true;
  if (user.value) {
    const docRef = doc(db, "users", user.value.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as User;

      const isProfileIncomplete =
        !data.username || !data.firstname || !data.lastname || !data.address;

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

export {
  fetchUserInfo,
  fetchData,
  checkAndLoadData,
  placeBetAndUpdateBalance,
  processGames,
  findOdds,
  fetchAccountBalance,
  formatGameTime,
  filterSortedGames,
  calculateTotalOdds,
  apiData,
  sortedGames,
  accountBalance,
  isLoading,
  showAlert,
  user,
  selectedTeams,
  showBettingSlip,
};
