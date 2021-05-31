const wsA = require('../webSocketsActions');
const aA = require('../games/avalon/avalonActions');
const { teams } = require('../games/avalon/characters');
const {getRandomBoolean} = require("../helpers");

const selectPlayers = (selectedPlayers, players, playersToSelect) => {
  if (!playersToSelect) return selectedPlayers;

  const randomIndex = Math.floor(Math.random() * players.length);
  const selectedPlayer = players[randomIndex];
  const restOfPlayers = players.filter((p, index) => index !== randomIndex);

  return selectPlayers([...selectedPlayers, selectedPlayer], restOfPlayers, playersToSelect - 1)
}

const getVotes = (numberOfPlayers, desiredResult) => [
  ...desiredResult.repeat(Math.round(numberOfPlayers / 2)),
  ...['a'.repeat((numberOfPlayers - Math.round(numberOfPlayers / 2)))].map(item => getRandomBoolean())
];

const clientExtension = (sendMessage) => ({
  joinGame: () => sendMessage({ type: wsA.JOIN_GAME, roomAbbrv: '54485' }),
  reconnect: function (){ this.openConnection() },
  disconnect: function() {
    this.socketConnection.close();
    this.socketConnection = null;
  },
  leaveGame: function(){
    sendMessage({ type: wsA.LEAVE_GAME, roomId: this.roomId });
    this.socketConnection.close();
    this.socketConnection = null;
  },
  registerOnConnectionObj: function (args){
    this._registerOnConnectionObject();
  },
  kingPlayerSelection: function({ players }){
    sendMessage({
      type: aA.KINGS_ASSIGNED_PLAYERS,
      assignedPlayers: selectPlayers([], Object.keys(players), this.playersToSelect),
      roomId: this.roomId
    })
  },
  voteForKingNominees: function ({ index, desiredResult, players }){
    const moreThanHalfOfPlayers = Math.round(Object.keys(players).length / 2);
    sendMessage({
      type: aA.VOTE_FOR_ASSIGNED_PLAYERS,
      roomId: this.roomId,
      voteForSuccess: moreThanHalfOfPlayers >= index + 1
        ? desiredResult
        : getRandomBoolean(0.5)
    });
  }
});

/**
 * The below code is for voting on success or failure for a mission
 voteForSuccess: this.character.team === teams.GOOD
 ? true
 : getRandomBoolean(0.3)
 */

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
