const wsA = require('../webSocketsActions');

const clientExtension = (sendMessage) => ({
  joinGame: () => sendMessage({ type: wsA.JOIN_GAME, roomId: '54485' }),
});

const clientExtFuncs = Object
  .keys(clientExtension())
  .reduce((acc, curr) => ({
    ...acc,
    [curr]: curr
  }), '');

module.exports = {
  clientExtension,
  clientExtFuncs
};
