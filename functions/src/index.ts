 /**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

 import * as functions from 'firebase-functions';
 import * as admin from 'firebase-admin';
 import axios from 'axios';
 
 
 // Start writing functions
 // https://firebase.google.com/docs/functions/typescript
 
 admin.initializeApp();
 
 interface GameResult {
   id: string;
   completed: boolean;
   home_team: string;
   away_team: string;
   scores: Score[];
 }
 
 interface Score {
   name: string;
   score: string;
 }
 
 interface BetData {
   stake: number;
   selectedTeams: { [gameId: string]: string }; // Mapping from game ID to selected team
   totalOdds: number;
   user: string;
   evaluated: "false" | "won" | "lost";
 }
 
 exports.evaluateBets = functions.pubsub.schedule('every 12 hours').onRun(async (_context) => {
   const betsRef = admin.firestore().collection('bets'); // Assuming your collection is named 'bets'
   const snapshot = await betsRef.where('evaluated', '==', 'false').get();
 
   if (snapshot.empty) {
     console.log('No unevaluated bets found');
     return null;
   }
 
   const evaluations = snapshot.docs.map(doc => {
     const betData: BetData = doc.data() as BetData;
     return evaluateBet(betData, doc.id);
   });
 
   await Promise.all(evaluations);
   return null;
 });
 
 async function evaluateBet(betData: BetData, betId: string) {
   const gameResults: GameResult[] = await fetchGameResults();
 
   let wonAllBets = true;
 
   for (const [gameId, homeOrAway] of Object.entries(betData.selectedTeams)) {
     const gameResult = gameResults.find(gr => gr.id === gameId);
     if (!gameResult || !gameResult.completed) {
       wonAllBets = false; // Game not found or not completed, can't evaluate
       break;
     }
 
     // Determine if the bet won based on 'home' or 'away' selection
     const winningTeamScore = gameResult.scores.reduce((a, b) => a.score > b.score ? a : b);
     const selectedTeamScore = gameResult.scores.find(score => score.name === (homeOrAway === 'home' ? gameResult.home_team : gameResult.away_team));
 
     if (!selectedTeamScore || winningTeamScore.name !== selectedTeamScore.name) {
       wonAllBets = false;
       break;
     }
   }
 
   // Update Firestore document
   await admin.firestore().collection('bets').doc(betId).update({
     evaluated: wonAllBets ? 'won' : 'lost'
   });
 }
 
 async function fetchGameResults(): Promise<GameResult[]> {
   try {
     const apiKey = functions.config().oddsapi.key;
     const response = await axios.get(`https://api.the-odds-api.com/v4/sports/icehockey_nhl/scores/?apiKey=${apiKey}&&daysFrom=1`);
     const data = response.data;
     
     return data.map((game: any): GameResult => {
       return {
         id: game.id,
         completed: game.completed,
         home_team: game.home_team,
         away_team: game.away_team,
         scores: [
           { name: game.home_team, score: game.scores[0].score.toString() },
           { name: game.away_team, score: game.scores[1].score.toString() }
         ]
       };
     });
   } catch (error) {
     console.error('Error fetching game results:', error);
     throw new Error('Failed to fetch game results');
   }
 }