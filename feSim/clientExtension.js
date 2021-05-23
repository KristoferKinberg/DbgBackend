const wsA = require('../webSocketsActions');

const clientExtension = (sendMessage) => ({
  joinGame: () => sendMessage({ type: wsA.JOIN_GAME, roomAbbrv: '54485' }),
  leaveGame: ({ roomId }) => sendMessage({ type: wsA.LEAVE_GAME, roomId }),
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
