const roundDetails = require('./roundDetails');
const Round = require('./round');

class Rounds {
  roundNumber = 0;
  currentRound;
  playerRounds;
  players;
  king;
  kingRound;

  constructor(players) {
    this.rounds = roundDetails[Object.values(players).length];
    this.players = players;
  }

  get king(){
    return this.king;
  }

  startRound = () => {
    this.roundNumber = this.roundNumber++;
    this.currentRound = new Round(this.players);
    //this.kingRound = 0;
  };

  getPlayersAsArray = () => Object.values(this.players);

  assignKing = () => {
    this.king = this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingRound);
    this.kingRound++;
  };
}

module.exports = Rounds;
