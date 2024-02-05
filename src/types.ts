import { ref } from "vue";

export type Bookmaker = {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
  };
  
export type Market = {
    key: string;
    outcomes: Outcome[];
  };
  
  export type Outcome = {
    name: string;
    price: number;
  };
  
  export type Game = {
    id: string;
    home_team: string;
    away_team: string;
    commence_time: string;
    bookmakers: Bookmaker[]; // Add bookmakers field here
  };
  
  export type GamesByDate = {
    [date: string]: Game[];
  };

  export interface AlertInputData {
    username: string;
    firstname: string;
    lastname: string;
    address: string;
  }

  export interface User {
    amount: number
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    address: string | null;
  }

  export const userInfo = ref<User>({
    amount: 100, 
    username: null,
    firstname: null,
    lastname: null,
    address: null
  });

  export type SelectedTeams = {
    [key: string]: 'home' | 'away';
  };

  type Bet = {
    team: string;
    odds: number; // Adjust the type based on your data structure
  };

  