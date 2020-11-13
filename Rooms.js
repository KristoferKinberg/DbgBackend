const { uuidv4 } = require('./helpers');

class Rooms {
  players = null;
  rooms = {};

  constructor(players) {
    this.players = players;
  }

  /**
   * Create room
   * @param roomId
   * @returns {{players: [], roomId: *}}
   */
  createRoom = (roomId) => ({
    roomId,
    players: [],
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
   * Add player to room
   * @param roomId
   * @param playerId
   */
  addPlayer = (roomId, playerId) => {
    this.rooms = {
      ...this.rooms,
      [roomId]: {
        ...this.rooms[roomId],
        players: [ ...this.rooms[roomId].players, playerId ]
      }
    };
  };

  /**
   * Get all rooms
   * @returns {{}}
   */
  getRooms = () => this.rooms;

  /**
   * Get specific room
   * @param roomId
   * @returns {*}
   */
  getRoom = roomId => this.rooms[roomId];

  /**
   * Get players
   * @param roomId
   * @returns {[]|*[]}
   */
  getPlayers = (roomId) => this.getRoom(roomId).players;
}

module.exports = Rooms;
