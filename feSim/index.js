const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const WebSocketClient = require('./TestSocket');
const {getRandomBoolean} = require("../helpers");
const {HOST, PLAYER} = require("../constants");
const term = require( 'terminal-kit' ).terminal ;
const { hostExtFuncs } = require('./hostExtension');
const { clientExtFuncs } = require('./clientExtension');

const timer = ms => new Promise(res => setTimeout(res, ms))

const connections = {
  HOST: null,
  PLAYERS: {},
}

const registerOnConnectionObject = (client) => {
  if (client && client.clientId) connections.PLAYERS = {
    ...connections.PLAYERS,
    [client.clientId]: client
  }
}

const createConnection = type => new WebSocketClient(type);

const connectHost = () => connections.HOST = createConnection(HOST);

/**
 * Runs a host function
 * @param functionName
 * @param rest
 * @returns {number}
 */
const runHost = ({ functionName, ...rest }) => connections.HOST[functionName](rest);

/**
 * Run a client function for all clients
 * @param funcKey
 * @returns {number}
 */
const runClients = ({ functionName, ...rest }) => Object.values(connections.PLAYERS)
    .forEach((player, index) => player[functionName]({ ...rest, index, players: connections.PLAYERS }));

const getPlayersObjectIds = () => Object.keys(connections.PLAYERS);

const clientLeaveGame = (index = 0) => () => {
  const { leaveGame, roomId } = Object.values(connections.PLAYERS)[index];
  return leaveGame({ roomId })
}

/**
 * Run a client function
 * @param playerIndex
 * @param funcKey
 * @param args
 * @returns {number}
 */
const runClient = (playerIndexCallback) => ({ functionName, ...args }) =>
  Object.values(connections.PLAYERS)[playerIndexCallback()][functionName]({ ...args, players: connections.PLAYERS });

const getKing = () => Object
  .values(connections.PLAYERS)
  .findIndex(Client => Client.isKing);

const clientsHaveRecievedIDs = () => {
  return connections.PLAYERS !== null
    ? Object.values(connections.PLAYERS).length === 5
    : false;
}

const playersConn = (conns) => ({functionName}) => {
  conns.forEach(conn => conn[functionName]());
}

const getConns = () => [...'a'.repeat(5)].map((item, index) => new WebSocketClient(PLAYER, index, registerOnConnectionObject, getPlayersObjectIds ));

const rounds = (roundsToRun, Rounds = []) => {
  const roundsLeft = roundsToRun - 1;
  if (roundsToRun === 0) return Rounds;

  return rounds(roundsLeft, [
    ...Rounds,
    { target: runClient(getKing), msg: 'King selects players for mission', functionName: clientExtFuncs.kingPlayerSelection },
    { target: runClients, msg: `Clients voting for King's nominees`, functionName: clientExtFuncs.voteForKingNominees, desiredResult: false },
    { target: runClient(getKing), msg: 'King selects players for mission', functionName: clientExtFuncs.kingPlayerSelection },
    { target: runClients, msg: `Clients voting for King's nominees`, functionName: clientExtFuncs.voteForKingNominees, desiredResult: true },
  ]);
}

const doConnection = () => [
  { target: connectHost, msg: 'Connecting host', functionName: '' },
  { target: runHost, msg: 'Host creating server', functionName: hostExtFuncs.createServer },
  { target: playersConn(getConns()), msg: 'Connecting players', functionName: clientExtFuncs.registerOnConnectionObj, condition: clientsHaveRecievedIDs },
  { target: runClients, msg: 'Clients joining game', functionName: clientExtFuncs.joinGame },
  { target: runHost, msg: 'Starting game', functionName: hostExtFuncs.startGame },
]

const testGameRun2 = [
  ...doConnection(),
  ...rounds(3),
];

const testClientReconnect = [
  ...doConnection(),
  { target: runClient(() => 0), msg: 'Client leaving game', functionName: clientExtFuncs.disconnect },
  { target: runClient(() => 0), msg: 'Client reconnecting', functionName: clientExtFuncs.reconnect }
];

const testClientLeave = [
  [connectHost, 'Connecting host', ''],
  [runHost, 'Host creating server', hostExtFuncs.createServer],
  [() => connections.PLAYERS = playersConnect(), 'Connecting players', ''],
  [runClients, 'Clients joining game', clientExtFuncs.joinGame],
  [clientLeaveGame(), 'Client left game', clientExtFuncs.leaveGame]
];

const duration = 300;

const sleeper = async ([nextFunctionStack, ...functionStacks], isRerun = false) => {
  const { target, msg, condition = () => true, ...args } = nextFunctionStack;
  term.bold.green(`\n\n${msg}...\n`);

  target(args);

  timer(duration).then(() => {
    if (condition()){
      term.brightBlue('Done!'+ '\n'.repeat(2));
      if (functionStacks.length) return sleeper(functionStacks);
    } else {
      sleeper([nextFunctionStack, ...functionStacks], true)
    }
  })
};

//sleeper(testGameRun2);
sleeper(testClientReconnect);

