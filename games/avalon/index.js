const {teamsGenerator, assignCharacter} = require('./teamGenerator');
const Round = require('./rounds/round');
const aA = require('./avalonActions');

class Avalon {
  king = null;
  kingRound = 0;
  round = 0;
  clients;
  players;
  room;
  characters;
  rounds;
  sendMessage;
  sendMessageToArr;
  registerMessageHandlers;

  constructor({ clients, room, registerMessageHandlers, messageHandler: { sendMessage, sendMessageToArr }}) {
    console.log('Avalon games started');

    this.clients = clients;
    this.rounds = {};
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
    this.registerMessageHandlers = registerMessageHandlers;

    this.assignCharacters();
    this.startGame();
  }

  getPlayersAsArray = () => Object.values(this.players);

  getRoundNumber = () => Object.keys(this.rounds).length + 1;

  assignCharacters = () => {
    const teams = teamsGenerator(Object.keys(this.clients));
    this.players = assignCharacter(Object.values(this.clients), {}, teams);

    this.getPlayersAsArray()
      .forEach(({ client, character }) => this.sendMessage({
        client,
        type: aA.ASSIGNED_CHARACTER,
        data: character
      }));
  }

  createNewRound = () => {
    this.rounds = {
      ...this.rounds,
      [Object.keys(this.rounds)]: Round({
        players: this.players,
        roundNumber: this.getRoundNumber(),
        registerMessageHandlers: this.registerMessageHandlers,
      }),
    }
  }

  startGame = () => {
    this.createNewRound();
  }
}

module.exports = Avalon;
