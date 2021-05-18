const games = require('./games/');

class Room {
  id;
  game;
  clients;

  constructor(id) {
    this.id = id;
    this.clients = [];
  }

  set clients (client){
    this.clients = client;
  }

  get clients (){
    return this.clients;
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
