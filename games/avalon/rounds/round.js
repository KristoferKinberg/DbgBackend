class Round {
  king;
  players;
  kingRound = 0;

  constructor(players) {
    this.players = players;

    this.startRound();
  }

  startRound = () => {
    this.assignKing();
    console.log(this.king, this.kingRound);
  }

  endRound = () => {

  }

  getPlayersAsArray = () => Object.values(this.players);

  assignKing = () => {
    this.king = this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingRound);
  };
}

module.exports = Round;
