const WS = require('ws');
const wsA = require('./webSocketsActions');
const Rooms = require('./Rooms');
const Clients = require('./Players');
const { getRoomByAbbrv } = require('./helpers');

class WebSocket {
  socketServer;
  messageHandlers;
  clients;
  rooms;

  constructor() {
    this.socketServer = new WS.Server({ port: 8080 });
    this.clients = new Clients();
    this.rooms = new Rooms(this.clients);
    this.addMessageHandlers({
      [wsA.RECONNECT]: this.reconnect,
      [wsA.CREATE_SERVER]: this.createServer,
      [wsA.JOIN_GAME]: this.joinGame,
    });

    console.log('Initiating socket server..');

    this.socketServer.on('connection', this.onConnection);
  }

  /**
   * On socket connection
   * @param socket
   */
  onConnection = (socket) => {
    const clientId = this.clients.addClient(socket);
    socket.send(JSON.stringify({ type: wsA.CLIENT_CONNECTED, clientId }));

    socket.on('message', this.onMessage(socket));
  };

  /**
   * On socket message
   * @param socket
   */
  onMessage = (socket) => (message) => {
    console.log('Message: ', message);
    if (!message) return;

    this.runThroughMessageHandlers(socket, message);
  }

  /**
   * Runs through the message handlers
   * @param socket
   * @param message
   */
  runThroughMessageHandlers = (socket, message) => {
    const { type, ...data } = JSON.parse(message);

    if (this.messageHandlers[type]){
      console.log(type);
      this.messageHandlers[type](socket, data)
    }
  };

  /**
   * On reconnect
   * @param socket
   * @param data
   */
  reconnect = (socket, data) => {
    this.clients.reconnectClient(data.clientId, data.newId);
  };

  /**
   * On create server
   * @param socket
   * @param data
   * @returns {undefined|void}
   */
  createServer = (socket, data) => {
    const roomId = this.rooms.addRoom(data.clientId);
    console.log('this is the rooms: ', this.rooms.getRoomsIds());

    return socket.send(JSON.stringify({
      type: wsA.ROOM_CREATION,
      roomId: data.clientId,
    }));
  }

  /**
   * On join game
   * @param socket
   * @param data
   */
  joinGame = (socket, data) => {
    const { roomId: roomAbbrv, clientId } = data;
    const roomId = getRoomByAbbrv(roomAbbrv, this.rooms.getRoomsIds());

    this.rooms.addClientToRoom(roomId, clientId);

    return [roomId, ...this.rooms.getRoomClients(roomId)].forEach(clientId => {
      this.clients.getClient(clientId).socket.send(JSON.stringify({
        type: wsA.PLAYER_JOINED,
        players: this.rooms.getRoomClients(roomId)
      }));
    });
  }

  /**
   * Add new message handlers
   * @param messageHandlers
   */
  addMessageHandlers = (messageHandlers) => {
    this.messageHandlers = {
      ...this.messageHandlers,
      ...messageHandlers
    };
  };
}

module.exports = WebSocket;
