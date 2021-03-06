const wsA = require('../webSocketsActions');
const clientIds = require('./clientIds');

const hostExtension = (sendMessage) => ({
  createServer: () => sendMessage({ type: wsA.CREATE_SERVER }),
  startGame: () => sendMessage({ type: wsA.START_GAME, roomId: clientIds[0], game: 'AVALON' })
});

module.exports = hostExtension;
