const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const WebSocketClient = require('./TestSocket');
const {HOST, PLAYER} = require("../constants");

const playersJoin = () => [...'a'.repeat(1)].reduce((acc, curr, index) => {
  return {
    ...acc,
    [`PLAYER_${index}`]: new WebSocketClient(PLAYER, index),
  }
}, {})

const connections = {
  HOST: null,
  PLAYERS: null,
}

const createConnection = type => new WebSocketClient(type);

const connectHost = () => {
  connections.HOST = createConnection(HOST);
}


/**
 * Runs a host function
 * @param funcKey
 * @returns {number}
 */
const runHost = (funcKey) => connections.HOST[funcKey]()

/**
 * Run a client function for all clients
 * @param funcKey
 * @returns {number}
 */
const runClients = (funcKey) => Object.keys(connections.PLAYERS)
    .forEach(playerKey => connections.PLAYERS[playerKey][funcKey]());

/**
 * Run a client function
 * @param funcKey
 * @param playerIndex
 * @returns {number}
 */
const runClient = (funcKey, playerIndex) => connections.PLAYERS[`PLAYER_${playerIndex}`][funcKey]();










const funcs = [
  [connectHost],
  //[runHost, 'createServer'],
  //[() => connections.PLAYERS = playersJoin()],
  //[runClients, 'joinGame'],
  //[runHost, 'startGame']
];

const duration = 200;

const sleep = async (index, func, ...args) => new Promise(resolve => setTimeout(() => {
    console.log(`waiting ${duration}`);
    resolve(func(...args));
  }, duration*index+1)
)

const abc123 = () => funcs.forEach(async ([func, ...args], index) =>
  await sleep(index, func, ...args));

sleep(10, abc123, '')

