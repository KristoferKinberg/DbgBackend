const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const WebSocketClient = require('./TestSocket');
const {HOST, PLAYER} = require("../constants");
const term = require( 'terminal-kit' ).terminal ;
const { hostExtFuncs } = require('./hostExtension');
const { clientExtFuncs } = require('./clientExtension');

const playersConnect = () => [...'a'.repeat(5)].reduce((acc, curr, index) => {
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
  [connectHost, 'Connecting host', ''],
  [runHost, 'Host creating server', hostExtFuncs.createServer],
  [() => connections.PLAYERS = playersConnect(), 'Connecting players', ''],
  [runClients, 'Clients joining game', clientExtFuncs.joinGame],
  [runHost, 'startGame', hostExtFuncs.startGame]
];

const duration = 200;

const sleep = async (index, func, msg, ...args) => new Promise(resolve => setTimeout(() => {
  term.bold.green('\n\n' + msg + '...\n');
  resolve(func(...args));
}, duration*index+1))

const abc123 = () => funcs.forEach(async ([func, ...args], index) => {
  await sleep(index, func, ...args)
  term.brightBlue('Done!'+ '\n'.repeat(2));
});

sleep(10, abc123, 'Starting..');
