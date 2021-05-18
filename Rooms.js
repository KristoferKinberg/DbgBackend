const { uuidv4 } = require('./helpers');
const games = require('./games/');
const Room = require('./Room');

class Rooms {
  game = null;
  clients = null;
  rooms = {};

  constructor(clients) {
    this.clients = clients;
  }

  /**
   * Create room
   * @param roomId
   * @returns {{clients: [], roomId: *}}
   */
  createRoom = (roomId) => new Room(roomId);

  /**
   * Add room
   * @returns {string}
   */
  addRoom = (roomIdd) => {
    const roomId = roomIdd ? roomIdd : uuidv4();
    this.rooms = { ...this.rooms, [roomId]: this.createRoom(roomId) }
    return roomId;
  };

  /**
   * Set games object to room
   * @param roomId
   * @param game
   */
  setRoomGame = (roomId, game) => {
    const Game = games[game];

    //this.updateRoom(roomId, 'game', new Game());
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
    this.rooms[roomId].addClient(client);
    //this.updateRoom(roomId, 'clients', [ ...this.rooms[roomId].clients, clientId ])

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
    return this.getRoom(roomId).clients;
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
