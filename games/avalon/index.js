const {teamsGenerator, assignCharacter} = require('./teamGenerator');

class Avalon {
  king = null;
  kingRound = 0;
  round = 0;
  clients;
  players;
  room;
  characters;

  constructor(clients, room) {
    console.log('Avalon games started');

    this.clients = clients;
    this.players = this.assignCharacters();
    this.startRound();
  }

  getPlayersAsArray = () => Object.values(this.players);

  assignCharacters = (clients) => {
    const teams = teamsGenerator(Object.keys(this.clients));

    return assignCharacter(Object.values(this.clients), {}, teams);
  }

  startRound = () => {
    this.assignKing();
    this.round = this.round++;
  }

  assignKing = () => {
    this.king = this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingRound);
    this.kingRound++;
  };
}

module.exports = Avalon;
