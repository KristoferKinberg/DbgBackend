const constants = require('./constants');

/**
 * Generate gui id
 * @returns {string}
 */
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Parse room id from abrevation
 * @param roomAbbrv
 * @returns {T}
 */
const parseRoomAbbrv = (roomAbbrv) => roomAbbrv
  .split('-')
  .reduce((acc, curr) => acc + curr.charAt(0), '');

/**
 * Returns room from abbrevation
 * @param roomAbbrv
 * @param rooms
 * @returns {*|number}
 */
const getRoomByAbbrv = (roomAbbrv, rooms) => rooms.find((room) => parseRoomAbbrv(room) === roomAbbrv)

/**
 * Returns client type
 * @param rooms
 * @param clients
 * @param clientId
 * @returns {string}
 */
const getClientType = (rooms, clients, clientId) => {
  if (rooms.getRoom(clientId)) return constants.HOST;
  if (clients.getClient(clientId).belongsTo) return constants.PLAYER;

  console.log("Couldn't determine client type");
  return false;
};

/**
 * Returns a random boolean
 *
 * @param oddsTweak - Allows for tweeking of the odds in each way
 * @returns {boolean}
 */
const getRandomBoolean = (oddsTweak = 0.5) => {
  return Math.random() < oddsTweak;
};

module.exports = {
  uuidv4,
  parseRoomAbbrv,
  getRoomByAbbrv,
  getClientType,
  getRandomBoolean
}
