const games = require('./games/');
const SocketWrapper = require('./Socket');
const wsA = require('./webSocketsActions');
const term = require( 'terminal-kit' ).terminal;

class Room {
  id;
  game;
  clients;
  owningClient;
  sendMessage;
  sendMessageToArr;
  messageHandlers;

  constructor({ id, client, messageHandler: { sendMessage, sendMessageToArr, registerRoom }}) {
    registerRoom(id, this.messageHandler);
    this.id = id;
    this.clients = [];
    this.owningClient = client;
    this.sendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
    this.messageHandlers = {
      [wsA.JOIN_GAME]: this.addClient,
      [wsA.START_GAME]: this.setAndStartGame,
      [wsA.LEAVE_GAME]: this.removeClient
    }
  }

  messageHandler = ({ type, ...args }) => {
    if (!type in this.messageHandlers) return term.bold.red(`Handler not found for type ${type}!`);

    this.messageHandlers[type](args);
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
  addClient = ({ client }) => {
    this.clients = {
      ...this.clients,
      [client.id]: client,
    }

    client.belongsTo = this.id;
    this.sendMessage({
      client,
      type: wsA.SUCCESSFULLY_JOINED,
      data: this.getRoomDataObject()
    })
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
   * @param client
   */
  removeClient = ({ clientId, client }) => { // TODO: Wouldn't it be enpugh to simply supply client..?
    const { [clientId]: toBeRemoved, ...rest } = this.clients;

    this.clients = rest;
    this.sendMessage({
      client,
      type: wsA.SUCCESSFULLY_LEFT_GAME,
    });
    this.sendMessageToArr({ clients: Object.values(this.clients), type: wsA.PLAYER_LEFT, players: Object.keys(this.clients) });

    term.cyan(`Client ${clientId} left the game. \n\n Players left: ${Object.keys(this.clients)}`);
  }

  /**
   * Sets room game
   * @param game
   */
  setAndStartGame = ({ game }) => {
    const Game = games[game];
    this.game = SocketWrapper(Game, false)({ clients: this.clients });
    this.sendToClients(wsA.STARTED_GAME, { game });
  }
}

module.exports = SocketWrapper(Room);
