const wsA = require('../webSocketsActions');

const clientExtension = (sendMessage) => ({
  joinGame: () => sendMessage({ type: wsA.JOIN_GAME, roomId: '54485' }),
});

module.exports = clientExtension;
