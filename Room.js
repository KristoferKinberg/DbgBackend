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

  set clients(client) {
    this.clients = client;
  }

  get clients() {
    return this.clients;
  }

  get clientIds() {
    return Object.keys(this.clients);
  }

  get owner (){
    return this.owningClient;
  }

  addClient = (client) => {
    this.clients = {
      ...this.clients,
      [client.id]: client,
    }
  }

  removeClient = clientId => {
    const { [clientId]: toBeRemoved, ...rest } = this.clients;
    this.clients = rest;
  }

  setGame = game => {
    const Game = games[game];
    this.game = new Game();
  }
}

module.exports = Room;
