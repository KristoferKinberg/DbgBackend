const WS = require('ws');
const wsA = require('./webSocketsActions');
const Rooms = require('./Rooms');
const Clients = require('./Clients');
const {getRoomByAbbrv} = require("./helpers");
const {parseRoomAbbrv} = require("./helpers");
const {HOST} = require("./constants");
const term = require( 'terminal-kit' ).terminal;

const mainFuncs = [
  wsA.RECONNECT,
  wsA.CREATE_SERVER,
]

const MessageHandlerWrapper = () => {
  const socketServer = new WS.Server({ port: 8080 });
  let rooms = {};
  const clients = new Clients();

  /**
   * On socket connection
   * @param socket
   */
  const onConnection = (socket) => {
    const client = clients.addClient(socket);
    sendMessage({
      client,
      type: wsA.CLIENT_CONNECTED,
      data: { clientId: client.id }
    });

    socket.on('message', onMessage(client));
  };

  socketServer.on('connection', onConnection);

  /**
   * Registers a new room
   * @param roomId
   * @param messageHandler
   */
  const registerRoom = (roomId, messageHandler) => rooms = { [roomId]: messageHandler, ...rooms }

  const deriveRoomId = ({ roomId, roomAbbrv }) => {
    if (roomId) return roomId;
    return roomAbbrv
      ? getRoomByAbbrv(roomAbbrv, Object.keys(rooms))
      : undefined;
  }

  /**
   * On socket message
   * @param socket
   */
  const onMessage = (socket) => (message) => {
    if (!message) return;

    const { type, ...data } = JSON.parse(message);
    const roomId = deriveRoomId(data);
    console.log(message)

    if (mainFuncs.includes(type)) return rooms.main({ type, roomId, ...data, socket });

    if (roomId in rooms) return rooms[roomId]({ type, roomId, client: socket, ...data });

    if (!(roomId in rooms)) {
      term.bold.red(`Room not found! \n`);
      term.red(`Room id: ${roomId}\n`);
    }
  }

  /**
   * Send message to client
   * @param socket
   * @param type
   * @param data
   * @returns {undefined|void}
   */
  const sendMessage = ({ client, type, data = {} }) =>
    client.socket.send(JSON.stringify({type, ...data}));

  /**
   * Sends message to array of clients
   * @param clients
   * @param type
   * @param data
   * @returns {*}
   */
  const sendMessageToArr = ({ clients, type, data }) => {
    clients.forEach((client) => sendMessage({ client, type, data }));
  }

  return {
    sendMessage,
    registerRoom,
    sendMessageToArr,
    clients
  }
};

const messageHandler = MessageHandlerWrapper();

const SocketWrapper = (Class, forRoom = true) => (args) => {
  const { clients, registerRoom, ...rest } = messageHandler;

  return new Class({
    ...args,
    messageHandler: forRoom
      ? messageHandler
      : rest,
  });
};

module.exports = SocketWrapper;
