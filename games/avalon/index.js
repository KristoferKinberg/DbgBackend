const {teamsGenerator, assignCharacter} = require('./teamGenerator');
const Round = require('./rounds/round');
const aA = require('./avalonActions');
const {teams} = require("./characters");

class Avalon {
  king = null;
  kingIndex = 0;
  round = 0;
  rounds = {};
  roundsSummaries = {};
  clients;
  players;
  room;
  characters;
  sendMessage;
  sendMessageToArr;
  registerMessageHandlers;

  constructor({ clients, room, registerMessageHandlers, messageHandler: { sendMessage, sendMessageToArr }}) {
    console.log('Avalon games started');

    this.clients = clients;
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

  setNextKingIndex = shouldIncrement => this.kingIndex = shouldIncrement
    ? this.kingIndex + 1
    : 0;

  setNextKing = () => {
    const shouldIncrement = !!this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingIndex + 1);

    this.setNextKingIndex(shouldIncrement);

    this.king = this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingIndex);
  };

  getKing = () => this.king;

  getActiveKingId = () => this.getPlayersAsArray()
    .find(({ playerIndex }) => playerIndex === this.kingIndex);

  createNewRound = () => {
    this.rounds = {
      ...this.rounds,
      [this.round]: Round({
        players: this.players,
        roundNumber: this.getRoundNumber(),
        getKing: this.getKing,
        setNextKing: this.setNextKing,
        registerMessageHandlers: this.registerMessageHandlers,
        onRoundEnd: this.onRoundEnd,
      }),
    }
  }

  startGame = () => {
    this.king = this.getActiveKingId();
    this.createNewRound();
  }

  startNewRound = () => {
    this.round = this.round + 1;
    this.setNextKing();
    this.createNewRound();
  }

  sumOfRounds = () => Object
    .values(this.roundsSummaries)
    .reduce((acc, curr) => ({ ...acc, [curr.winner]: acc[curr.winner] + 1 })
      , { [teams.GOOD]: 0, [teams.EVIL]: 0 });

  gameHasFinished = () => {
    const result = this.sumOfRounds();

    return result[teams.GOOD] === 3 || result[teams.EVIL] === 3;
  }

  onRoundEnd = (endSummary) => {
    this.roundsSummaries = {
      ...this.roundsSummaries,
      [this.round]: endSummary
    };

    if (this.gameHasFinished()) return console.log('THE GAME HAS FINISHED');

    this.startNewRound();
  }
}

module.exports = Avalon;
