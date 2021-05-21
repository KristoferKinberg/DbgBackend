const WS = require('ws');
const wsA = require('./webSocketsActions');
const Rooms = require('./Rooms');
const Clients = require('./Clients');
const {HOST} = require("./constants");
const { getRoomByAbbrv, getClientType } = require('./helpers');
const SocketWrapper = require('./Socket');

class Main {
  socketServer;
  messageHandlers;
  rooms;
  clients;
  sendMessage;
  sendMessageToArr;

  constructor({ messageHandler: { clients, sendMessage, registerRoom, sendMessageToArr }}) {
    this.clients = clients;
    this.sendMessage = sendMessage;
    this.mainsendMessage = sendMessage;
    this.sendMessageToArr = sendMessageToArr;
    this.rooms = new Rooms({ clients: this.clients });
    this.messageHandlers = {
      [wsA.RECONNECT]: this.reconnect,
      [wsA.CREATE_SERVER]: this.createServer,
      [wsA.JOIN_GAME]: this.joinGame,
      [wsA.LEAVE_GAME]: this.leaveGame,
      [wsA.START_GAME]: this.startGame,
    }

    registerRoom('main', this.handleMessage)
    console.log('Initiating socket server..');
  }

  handleMessage = ({ type, ...data }) => {
    this.messageHandlers[type](data);
  };

  /**
   * On reconnect
   * @param socket
   * @param data
   */
  reconnect = (socket, data) => {
    const clients = this.clients.reconnectClient(data.clientId, data.newId);
    const clientType = getClientType(this.rooms, this.clients, data.clientId);

    if (clientType) {
      const roomId = clientType === HOST
        ? data.clientId
        : this.clients.getClient(data.clientId).belongsTo;

      this.sendMessage(socket, wsA.SUCCESSFULLY_RECONNECTED, {
        clientType,
        ...this.rooms.getRoomDataObject(roomId)
      })
    }
  };

  /**
   * On create server
   * @param data
   * @returns {undefined|void}
   */
  createServer = (data) => {
    const client = this.clients.getClient(data.clientId);
    const roomId = this.rooms.addRoom(client);

    return this.sendMessage(client.socket, wsA.ROOM_CREATION, this.rooms.getRoomDataObject(roomId))
  }

  sendToRoom = (roomId, type, data) => {
    const room = this.rooms.getRoom(roomId);

    return this.sendMessageToArr(
      [room.owner, ...Object.values(room.clients)],
      type,
      data
    );
  }

  /**
   * On join games
   * @param socket
   * @param data
   */
  joinGame = ({ roomId: roomAbbrv, clientId }) => {
    const roomId = getRoomByAbbrv(roomAbbrv, this.rooms.getRoomsIds());
    const room = this.rooms.getRoom(roomId);
    const client = this.clients.getClient(clientId)

    if (room && clientId in room.clients) return; // TODO: THIS IS WHERE RECONNECT LOGIC SHOULD BE PROBABLY

    this.rooms.addClientToRoom(roomId, this.clients.getClient(clientId));
  };

  /**
   * Leave games
   * @param socket
   * @param data
   * @returns {*}
   */
  leaveGame = (socket, data) => {
    const { roomId, clientId } = data;

    this.rooms.removeClientFromRoom(roomId, clientId);
    this.clients[clientId].leaveGame()
    this.sendMessage(socket, wsA.SUCCESSFULLY_LEFT_GAME, {});

    return this.sendToRoom(roomId, wsA.PLAYER_LEFT, { players: this.rooms.getRoomClients(roomId) })
  };

  /**
   * Start a games
   */
  startGame = ({ roomId, clientId, game }) => this.rooms.setRoomGame(roomId, game);
}

module.exports = SocketWrapper(Main);
