const SocketWrapper = require("../../../Socket");
const aA = require("../avalonActions");
const RoundsRules = require("./roundDetails");

class Round {
  king;
  players;
  kingRound = 0;
  roundDetails;
  kingNominees;
  registerMessageHandlers;
  sendMessage;
  sendMessageToArr;

  constructor({ players, roundNumber, registerMessageHandlers, messageHandler: { sendMessage, sendMessageToArr }}) {
    this.players = players;
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
    this.roundDetails = RoundsRules[this.getPlayersAsArray().length][`q${roundNumber}`];

    registerMessageHandlers(this.getMessageHandlers());

    this.startRound();
  }

  /**
   * Returns object with messageHandlers for a round
   * @returns {}
   */
  getMessageHandlers = () => ({
    [aA.KINGS_ASSIGNED_CHARACTERS]: this.assignKingsNominees
  });

  /**
   * Handles response from current king with the suggestion of players to go on mission
   * @param args
   */
  assignKingsNominees = (...args) => {
    console.log(args);
  }

  /**
   * Sets up necessary data and starts the round
   */
  startRound = () => {
    this.assignKing();
  }

  /**
   * Finishes the round
   */
  endRound = () => {

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
  assignKing = () => {
    this.king = this.getPlayersAsArray()
      .find(({ playerIndex }) => playerIndex === this.kingRound);

    this.sendMessageToArr({
      clients: this.getPlayerClients(),
      type: aA.ASSIGNED_KING,
      data: {
        kingId: this.getClientId(this.king),
        playersToSelect: this.roundDetails.playersOnAssignment
      }
    });
  };
}

module.exports = SocketWrapper(Round);
