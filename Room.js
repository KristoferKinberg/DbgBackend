const games = require('./games/');

class Room {
  id;
  game;
  clients;
  owningClient;

  constructor(id, client) {
    this.id = id;
    this.clients = [];
    this.owningClient = client;
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
   * Adds a client to the room
   * @param client
   */
  addClient = (client) => {
    this.clients = {
      ...this.clients,
      [client.id]: client,
    }
  }

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
  }
}

module.exports = Room;
