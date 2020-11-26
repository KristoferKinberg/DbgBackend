const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const WebSocketClient = require('./TestSocket');

const players = [...'a'.repeat(5)].reduce((acc, curr, index) => {
  return {
    ...acc,
    [`PLAYER_${index}`]: new WebSocketClient('PLAYER', index),
  }
}, {})

const connections = {
  HOST: new WebSocketClient('HOST', 0),
  PLAYERS: players,
}

/**
 * Waits 300 ms to run func
 * @param func
 * @returns {number}
 */
const timeOutWrap = (func) => setTimeout(func, 300);

/**
 * Runs a host function
 * @param funcKey
 * @returns {number}
 */
const runHost = (funcKey) => timeOutWrap(
  () => connections.HOST[funcKey]()
);

/**
 * Run a client function for all clients
 * @param funcKey
 * @returns {number}
 */
const runClients = (funcKey) => timeOutWrap(
  () => Object.keys(connections.PLAYERS)
    .forEach(playerKey => connections.PLAYERS[playerKey][funcKey]())
);

/**
 * Run a client function
 * @param funcKey
 * @param playerIndex
 * @returns {number}
 */
const runClient = (funcKey, playerIndex) => timeOutWrap(
  () => connections.PLAYERS[`PLAYER_${playerIndex}`][funcKey]()
);

runHost('createServer');
runClients('joinGame');
runHost('startGame');
