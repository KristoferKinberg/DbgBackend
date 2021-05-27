const wsA = require('../webSocketsActions');
const aA = require('../games/avalon/avalonActions');

const selectPlayers = (selectedPlayers, players, playersToSelect) => {
  if (!playersToSelect) return selectedPlayers;

  const randomIndex = Math.floor(Math.random() * players.length);
  const selectedPlayer = players[randomIndex];
  const restOfPlayers = players.filter((p, index) => index !== randomIndex);


  return selectPlayers([...selectedPlayers, selectedPlayer], restOfPlayers, playersToSelect - 1)
}

const clientExtension = (sendMessage) => ({
  joinGame: () => sendMessage({ type: wsA.JOIN_GAME, roomAbbrv: '54485' }),
  leaveGame: ({ roomId }) => sendMessage({ type: wsA.LEAVE_GAME, roomId }),
  registerOnConnectionObj: function (args){
    this._registerOnConnectionObject();
  },
  kingPlayerSelection: function({ players }){
    sendMessage({
      type: aA.KINGS_ASSIGNED_CHARACTERS,
      assignedPlayers: selectPlayers([], Object.keys(players), this.playersToSelect),
      roomId: this.roomId
    })
  },
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
