const { uuidv4 } = require('./helpers');

class Rooms {
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
  createRoom = (roomId) => ({
    roomId,
    clients: [],
  });

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
   * @param clientId
   */
  addClientToRoom = (roomId, clientId) => {
    console.log('roomId', roomId);
    this.rooms = {
      ...this.rooms,
      [roomId]: {
        ...this.rooms[roomId],
        clients: [ ...this.rooms[roomId].clients, clientId ]
      }
    };

    this.clients.setClientBelonging(clientId, roomId);
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
  getRoomClients = (roomId) => this.getRoom(roomId).clients;

  /**
   * Remove a client from a room
   * @param roomId
   * @param clientId
   */
  removeClientFromRoom = (roomId, clientId) => {
    console.log(this.rooms, roomId);
    this.rooms = {
      ...this.rooms,
      [roomId]: {
        ...this.getRoom(roomId),
        clients: this.getRoom(roomId).clients.filter((roomClientId) => roomClientId !== clientId),
      }
    }
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
