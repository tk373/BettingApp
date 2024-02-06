  <template>
      <ion-list class="game-list">
      <template v-for="(games, date) in sortedGames">
        <ion-item-divider>
          <ion-label>{{ new Date(date).toLocaleDateString() }}</ion-label>
        </ion-item-divider>
        <ion-item v-for="game in games" :key="game.id" class="game-item">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-md="4" class="team home-team">
                {{ game.home_team }}
                <img :src="logoUrl(game.home_team)" class="team-icon" alt="Home Team Logo" />
                <button class="odds-button" :class="{ 'clicked': selectedTeams[game.id] === 'home' }" @click="selectTeam(game.id, 'home')">
                  {{ findOdds(game.bookmakers, game.home_team) }}
                </button>
              </ion-col>

              <ion-col size="12" size-md="4" class="commence-time">
                {{ formatGameTime(game.commence_time) }}
              </ion-col>

              <ion-col size="12" size-md="4" class="team away-team">
                <button class="odds-button" :class="{ 'clicked': selectedTeams[game.id] === 'away' }" @click="selectTeam(game.id, 'away')">
                  {{ findOdds(game.bookmakers, game.away_team) }}
                </button>
                <img :src="logoUrl(game.away_team)" class="team-icon" alt="Away Team Logo" />
                {{ game.away_team }}
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </template>
    </ion-list>

    <div v-if="selectedBetsCount > 0" class="betting-slip-bar" @click="showBettingSlip = !showBettingSlip">
    Betting Slip
    <span class="bets-count">{{ selectedBetsCount }}</span>
  </div>
    </template>

  <script lang="ts" setup>
  import { IonList, IonItem, IonItemDivider, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/vue';
  import { Ref, computed, onMounted, ref } from 'vue';
  import { formatGameTime, findOdds, checkAndLoadData, sortedGames, showBettingSlip } from '../dataCollection';
  import BettingSlip from './BettingSlip.vue';
  import { selectedTeams } from '../dataCollection';

  onMounted(async () => {
    console.log(selectedTeams);
      await checkAndLoadData().catch(error => {
          console.error('Error during initial data load:', error);
      });
      const savedSelections = localStorage.getItem('selectedTeams');
      if (savedSelections) {
      // Merge saved selections with the existing state to preserve reactivity
      Object.assign(selectedTeams.value, JSON.parse(savedSelections));
      }
  });

  const hasSelectedBets = computed(() => {
    return Object.keys(selectedTeams.value).length > 0;
  });
  const selectedBetsCount = computed(() => {
    return Object.keys(selectedTeams.value).length;
  });

  const logoUrl = (teamName: string) => {
    const formattedName = teamName.replace(/\s+/g, '-').toLowerCase().replace("é", "e");
    return `/${formattedName}-logo@logotyp.us.svg`; 
  };

  const selectTeam = (gameId: string, team: 'home' | 'away') => {
    if (selectedTeams.value[gameId] === team) {
      // If the team is already selected, unselect it
      delete selectedTeams.value[gameId];
    } else {
      // Otherwise, select the team
      selectedTeams.value[gameId] = team;
    }
    localStorage.setItem('selectedTeams', JSON.stringify(selectedTeams.value));
  };

  </script>

  <style scoped>
  .betting-slip-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: blue;
  color: white;
  text-align: center;
  padding: 10px 0;
  font-size: 18px;
  z-index: 100; /* Ensure it's above other content */
}

.bets-count {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: blue;
  border-radius: 50%;
  width: 24px; /* Equal width and height */
  height: 24px; /* Equal width and height */
  font-size: 14px;
  margin-left: 10px;
  vertical-align: middle;
}

.game-item {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px;
  border-bottom: 1px solid grey;
  margin: 0px; /* Adjusted padding for better spacing */
}

.team, .commence-time {
  display: flex;
  align-items: center; /* Align items vertically */
  justify-content: center; /* Center content for commence-time */
  text-align: center; /* Center-align text for consistent look */
  padding: 0px 0; /* Adjust padding for spacing */
}
.list-md{
  padding-top: 0px;
}
.team-icon {
  height: 60px; /* Adjust size for better visibility */
  width: 60px; /* Keep aspect ratio */
  margin-right: 10px; /* Space between icon and team name */
  object-fit: contain; /* Ensure logo maintains aspect without distortion */
}
.home-team, .away-team {
  justify-content: flex-start; /* Align items to the start for home team */
  flex-wrap: wrap; /* Allow items to wrap if needed */
}
.away-team {
  justify-content: flex-end; /* Align items to the end for away team */
}

.odds-button {
  border: 1px solid blue; /* Visibility */
  color: blue; /* Theme consistency */
  cursor: pointer;
  font-weight: bold;
  padding: 7px 10px;
  margin-left: 5px; /* Spacing between team name and button */
  border-radius: 4px;
  background-color: white;
}
.clicked {
  background-color: blue;
  color: white;
}

@media (max-width: 768px) {
  .game-item {
    border-bottom: 2px solid grey; /* Stronger border for clear separation */
    margin-bottom: 15px; /* Increased space between games */
  }

  .team {
    flex-direction: row;
    justify-content: center;
    padding: 5px 0;
  }

  .team-icon {
    height: 40px;
    width: 40px;
    margin-right: 5px; /* Adjust for home team */
  }

  .away-team {
    flex-direction: row-reverse; /* Reverse the order for away team stack */
    justify-content: center; /* Center align items */
  }

  .away-team .team-icon {
    margin-right: 0;
    margin-left: 10px; /* Adjust spacing for reversed order */
  }

  .odds-button {
    padding: 3px 7px;
    font-size: 14px;
  }
}
  </style>