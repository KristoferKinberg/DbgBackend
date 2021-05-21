const {teamsGenerator, assignCharacter} = require('./teamGenerator');
const Rounds = require('./rounds/rounds');

class Avalon {
  king = null;
  kingRound = 0;
  round = 0;
  clients;
  players;
  room;
  characters;
  rounds;

  constructor(clients, room) {
    console.log('Avalon games started');

    this.clients = clients;
    this.players = this.assignCharacters();
    this.rounds = new Rounds(this.players);
    this.startGame();
  }

  getPlayersAsArray = () => Object.values(this.players);

  assignCharacters = (clients) => {
    const teams = teamsGenerator(Object.keys(this.clients));

    return assignCharacter(Object.values(this.clients), {}, teams);
  }

  startGame = () => {
    this.rounds.startRound();
  }
}

module.exports = Avalon;
