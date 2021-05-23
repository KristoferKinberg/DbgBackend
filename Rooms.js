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
  createRoom = (roomId, client) => Room({ id: roomId, client });

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
   * Delete room
   * @param roomId
   */
  deleteRoom = (roomId) => {
    const { [roomId]: toBeRemoved, ...rest } = this.rooms;
    this.rooms = rest;
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
