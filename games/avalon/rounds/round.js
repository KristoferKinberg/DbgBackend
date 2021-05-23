const SocketWrapper = require("../../../Socket");
const AvalonActions = require("../avalonActions");

class Round {
  king;
  players;
  kingRound = 0;
  sendMessage;
  sendMessageToArr;

  constructor({ players, messageHandler: { sendMessage, sendMessageToArr }}) {
    this.players = players;
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;

    this.startRound();
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
      type: AvalonActions.ASSIGNED_KING,
      data: { kingId: this.getClientId(this.king )}
    });
  };
}

module.exports = SocketWrapper(Round);
