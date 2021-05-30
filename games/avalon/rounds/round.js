const SocketWrapper = require("../../../Socket");
const aA = require("../avalonActions");
const { roundDetails, maxAllowedFailedKingSelections } = require("./roundDetails");
const { teams } = require('../characters');

const roundStatuses = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}

class Round {
  players;
  kingRound = 0;
  roundDetails;
  getKing;
  roundNumber;
  setNextKing;
  registerMessageHandlers;
  sendMessage;
  sendMessageToArr;
  kingRounds = {};
  missionVotes = {}
  onRoundEnd;
  roundStatus = roundStatuses.NOT_STARTED;

  constructor({ players, roundNumber, getKing, setNextKing, registerMessageHandlers, onRoundEnd, messageHandler: { sendMessage, sendMessageToArr }}) {
    this.players = players;
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
    this.roundDetails = roundDetails[this.getPlayersAsArray().length][`q${roundNumber}`];
    this.getKing = getKing;
    this.setNextKing = setNextKing;
    this.onRoundEnd = onRoundEnd;

    registerMessageHandlers(this.getMessageHandlers());

    this.startRound();
  }

  /**
   * Returns object with messageHandlers for a round
   * @returns {}
   */
  getMessageHandlers = () => ({
    [aA.KINGS_ASSIGNED_PLAYERS]: this.assignKingsNominees,
    [aA.VOTE_FOR_ASSIGNED_PLAYERS]: this.handleVoteForKingsNominees,
    [aA.VOTE_FOR_MISSION]: this.handleVoteForMission,
  });

  /**
   * Handles response from current king with the suggestion of players to go on mission
   * @param args
   */
  assignKingsNominees = ({ assignedPlayers }) => {
    this.updateKingRound(this.kingRound, 'nominees', assignedPlayers);

    this.sendMessageToArr({
      clients: this.getPlayerClients(),
      type: aA.REQUEST_VOTE_FOR_ASSIGNED_PLAYERS,
      data: { kingsNominees: assignedPlayers },
    });
  }

  /**
   * Sets up necessary data and starts the round
   */
  startRound = () => {
    this.roundStatus = roundStatuses.IN_PROGRESS;
    this.addKingRound();
    this.communicateAssignedKing();
  }

  incrementKingRound = () => {
    if (this.kingRound !== 5) this.kingRound = this.kingRound + 1;
  }

  runNextKingRound = () => {
    this.incrementKingRound();

    this.setNextKing();
    this.addKingRound();
    this.communicateAssignedKing();
  };

  /**
   * Finishes the round
   */
  endRound = () => {
    this.roundStatus = roundStatuses.COMPLETED;
    const summary = this.summarizeRound();
    console.log(`ROUND ENDED, TEAM ${summary.winner} WON!!`);
    this.onRoundEnd(summary);
  }

  createNewKingRound = () => ({
    king: this.getKing().client.id,
    nominees: [],
    votes: {},
    result: null
  });

  addKingRound = () => {
    this.kingRounds = {
      ...this.kingRounds,
      [this.kingRound]: this.createNewKingRound()
    }
  }

  /**
   * Returns players as array
   * @returns {players[]}
   */
  getPlayersAsArray = () => Object.values(this.players);

  /**
   * Returns clients
   * @returns {Round.players.client[]}
   */
  getPlayerClients = () => this.getPlayersAsArray()
    .map(({ client }) => client);

  /**
   * Return client id
   * @param id
   * @returns {*}
   */
  getClientId = ({ client: { id }}) => id;

  /**
   * Assigns correct player king
   */
  communicateAssignedKing = () => {
    this.sendMessageToArr({
      clients: this.getPlayerClients(),
      type: aA.ASSIGNED_KING,
      data: {
        kingId: this.getKing().client.id,
        playersToSelect: this.roundDetails.playersOnAssignment
      }
    });
  };

  /**
   * Returns the number of players
   * @returns {number}
   */
  getNumberOfPlayers = () => this.getPlayersAsArray().length;

  /**
   * Returns the votes for the kings nominees
   * @returns {boolean[]}
   */
  getKingNomineesVotes = () => Object.values(this.kingRounds[this.kingRound].votes);

  /**
   * Returns boolean whether the kings proposed nominees where approved by the rest of the players
   * @returns {boolean}
   */
  kingNomineesAccepted = () =>
    Math.round(this.getNumberOfPlayers() / 2) <= this.getKingNomineesVotes().filter(vote => vote).length;

  /**
   * Updates a king round
   * @returns {}
   */
  updateKingRound = (kingRound, key, value) => this.kingRounds = {
    ...this.kingRounds,
    [kingRound]: {
      ...this.kingRounds[kingRound],
      [key]: value
    }
  }

  /**
   * Returns boolean whether all allowed king rounds have been spent or not
   * @returns {boolean}
   */
  kingRoundsSpent = () => this.kingRound + 1 >= maxAllowedFailedKingSelections;

  /**
   * Handle collecting of clients votes for kings nominees
   * @param clientId
   * @param voteForSuccess
   */
  handleVoteForKingsNominees = ({ clientId, voteForSuccess }) => {
    if (Object.keys(this.getKingNomineesVotes()).length === this.getNumberOfPlayers()) return;

    this.updateKingRound(this.kingRound, 'votes', { ...this.kingRounds[this.kingRound].votes, [clientId]: voteForSuccess })

    if (this.getKingNomineesVotes().length === this.getNumberOfPlayers()){
      const kingNomineesAccepted = this.kingNomineesAccepted();
      this.updateKingRound(this.kingRound, 'result', kingNomineesAccepted)

      this.sendMessageToArr({
        clients: this.getPlayerClients(),
        type: aA.REVEAL_KINGS_ASSIGNED_PLAYERS_VOTE_RESULT,
        data: { kingNomineesAccepted }
      });

      if (kingNomineesAccepted)
        return this.runMission();

      if (this.kingRoundsSpent() && !kingNomineesAccepted)
        return this.endRound();

      this.runNextKingRound();
    }
  }

  /**
   * Runs a mission
   */
  runMission = () => {
    const clients = this.kingRounds[this.kingRound].nominees
      .map(playerId => this.players[playerId].client);

    this.sendMessageToArr({
      clients,
      type: aA.REQUEST_VOTE_FOR_MISSION,
    });
  }

  /**
   * Handles incoming votes for a mission to succeed or not
   * @param clientId
   * @param voteForSuccess
   */
  handleVoteForMission = ({ clientId, voteForSuccess }) => {
    this.missionVotes = {
      ...this.missionVotes,
      [clientId]: voteForSuccess,
    };

    const nominees = this.kingRounds[this.kingRound].nominees;
    const votes = Object.values(this.missionVotes);

    if (nominees.length === votes.length) {
      this.endRound();
    }
  }

  /**
   * Summarizes a round
   * @returns {{winner: string, roundVotes: *, roundStatus: string, kingRounds: {}}}
   */
  summarizeRound = () => ({
    winner: this.declareMissionWinner(Object.values(this.missionVotes)),
    kingRounds: this.kingRounds,
    roundVotes: this.missionVotes,
    roundStatus: this.roundStatus,
  })

  /**
   * Figures out which team won the round
   * @param votes
   * @returns {string}
   */
  declareMissionWinner = votes =>
    votes.filter(vote => vote).length === votes.length
      ? teams.GOOD
      : teams.EVIL
}

module.exports = SocketWrapper(Round);
