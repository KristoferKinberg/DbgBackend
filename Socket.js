const WS = require('ws');
const wsA = require('./webSocketsActions');
const Rooms = require('./Rooms');
const Clients = require('./Clients');
const {HOST} = require("./constants");

const MessageHandlerWrapper = () => {
  const socketServer = new WS.Server({ port: 8080 });
  let rooms = {};
  const clients = new Clients();

  /**
   * On socket connection
   * @param socket
   */
  const onConnection = (socket) => {
    const clientId = clients.addClient(socket);
    sendMessage(socket, wsA.CLIENT_CONNECTED, { clientId });

    socket.on('message', onMessage(socket));
  };

  socketServer.on('connection', onConnection);

  /**
   * Registers a new room
   * @param roomId
   * @param messageHandler
   */
  const registerRoom = (roomId, messageHandler) => rooms = { [roomId]: messageHandler, ...rooms }

  /**
   * On socket message
   * @param socket
   */
  const onMessage = (socket) => (message) => {
    if (!message) return;

    const { type, roomId, ...data } = JSON.parse(message);

    if (type in wsA) return rooms.main({ type, roomId, ...data });

    if (roomId in rooms) return rooms[roomId]({ type, roomId, ...data });
  }

  /**
   * Send message to client
   * @param socket
   * @param type
   * @param data
   * @returns {undefined|void}
   */
  const sendMessage = (socket, type, data = {}) =>
    socket.send(JSON.stringify({type, ...data}));

  /**
   * Sends message to array of clients
   * @param clients
   * @param type
   * @param data
   * @returns {*}
   */
  const sendMessageToArr = ({ clients, type, data }) => {
    clients.forEach(({ socket }) => sendMessage(socket, type, data));
  }


  return {
    sendMessage,
    registerRoom,
    sendMessageToArr,
    clients
  }
};

const messageHandler = MessageHandlerWrapper();

const SocketWrapper = (Class) => (...args) => {
  return new Class({ ...args, messageHandler })
};

module.exports = SocketWrapper;
