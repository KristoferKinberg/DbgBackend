const games = require('./games/');
const SocketWrapper = require('./Socket');
const wsA = require('./webSocketsActions');

class Room {
  id;
  game;
  clients;
  owningClient;
  sendMessage;
  sendMessageToArr;

  constructor({ id, client, messageHandler: { sendMessage, sendMessageToArr }}) {
    this.id = id;
    this.clients = [];
    this.owningClient = client;
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
  }

  /**
   * Set clients
   * @param client
   */
  set clients(client) {
    this.clients = client;
  }

  /**
   * Get clients
   * @returns {*}
   */
  get clients() {
    return this.clients;
  }

  /**
   * Get client ids as array
   * @returns {string[]}
   */
  get clientIds() {
    return Object.keys(this.clients);
  }

  /**
   * Get room owner
   * @returns {*}
   */
  get owner (){
    return this.owningClient;
  }

  /**
   * Returns an object with nessessary room data for clients
   * @returns {{players: *[], roomId: *}}
   */
  getRoomDataObject = () => ({
    roomId: this.id,
    players: Object.keys(this.clients),
  });

  /**
   * Adds a client to the room
   * @param client
   */
  addClient = (client) => {
    this.clients = {
      ...this.clients,
      [client.id]: client,
    }

    this.sendMessage(client.socket, wsA.SUCCESSFULLY_JOINED, this.getRoomDataObject());
    this.sendToClients(wsA.PLAYER_JOINED, this.getRoomDataObject());
  }

  /**
   * Send to all room clients
   * @param type
   * @param data
   * @returns {*}
   */
  sendToClients = (type, data) => this.sendMessageToArr({
    clients: Object.values(this.clients),
    type: wsA.PLAYER_JOINED,
    data: data
  });

  /**
   * Removes a client from the room
   * @param clientId
   */
  removeClient = clientId => {
    const { [clientId]: toBeRemoved, ...rest } = this.clients;
    this.clients = rest;
  }

  /**
   * Sets room game
   * @param game
   */
  setGame = game => {
    const Game = games[game];
    this.game = new Game(this.clients);
    this.sendToClients(wsA.STARTED_GAME, { game });
  }
}

module.exports = SocketWrapper(Room);
