const { uuidv4 } = require('./helpers');
const games = require('./games/');
const Room = require('./Room');
const {getNextId} = require("./feSim/clientIds");
const term = require( 'terminal-kit' ).terminal;

class Rooms {
  game = null;
  clients = null;
  isDev = true;
  rooms = {};

  constructor({ clients }) {
    this.clients = clients;
  }

  /**
   * Create room
   * @param roomId
   * @param client
   * @returns {{clients: [], roomId: *}}
   */
  createRoom = (roomId, client) => Room(roomId, client);

  /**
   * Returns correct room id
   * @param roomId
   * @returns {*|string}
   */
  getRoomId = (roomId) => {
    if (this.isDev) return getNextId();

    return roomId
      ? roomId
      : uuidv4();
  }

  /**
   * Add room
   * @param client
   * @returns {string}
   */
  addRoom = (client) => {
    const roomId = this.getRoomId(client.id);
    this.rooms = { ...this.rooms, [roomId]: this.createRoom(roomId, client) }
    return roomId;
  };

  /**
   * Set games object to room
   * @param roomId
   * @param game
   */
  setRoomGame = (roomId, game) => {
    this.getRoom(roomId).setGame(game);
  }

  /**
   * Delete room
   * @param roomId
   */
  deleteRoom = (roomId) => {
    const { [roomId]: toBeRemoved, ...rest } = this.rooms;
    this.rooms = rest;
  };

  /**
   * Add client to room
   * @param roomId
   * @param client
   */
  addClientToRoom = (roomId, client) => {
    if (!(roomId in this.rooms)) {
      term.bold.red(`Room not found! \n`);
      term.red(`Room id: ${roomId}`);
    }

    this.rooms[roomId].addClient(client);
    this.clients.setClientBelonging(client.id, roomId);
  };

  /**
   * Get all rooms
   * @returns {{}}
   */
  getRooms = () => this.rooms;

  /**
   * Return array of room ids
   * @returns {string[]}
   */
  getRoomsIds = () => Object.keys(this.rooms);

  /**
   * Get specific room
   * @param roomId
   * @returns {*}
   */
  getRoom = roomId => this.rooms[roomId];

  /**
   * Get clients in room
   * @param roomId
   * @returns {[]|*[]}
   */
  getRoomClients = (roomId) => {
    return Object.values(this.getRoom(roomId).clients);
  }

  /**
   * Remove a client from a room
   * @param roomId
   * @param clientId
   */
  removeClientFromRoom = (roomId, clientId) => {
    this.rooms[roomId].removeClient(clientId);
  };

  /**
   * Returns an object with nessessary room data for clients
   * @param roomId
   * @returns {{players: *[], roomId: *}}
   */
  getRoomDataObject = (roomId) => ({
    roomId,
    players: this.getRoomClients(roomId),
  });
}

module.exports = Rooms;
