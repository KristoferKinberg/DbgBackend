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

      this.sendMessage({
        socket,
        type: wsA.SUCCESSFULLY_RECONNECTED,
        data: { clientType, ...this.rooms.getRoomDataObject(roomId)}
      });
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

    return this.sendMessage({
      client,
      type: wsA.ROOM_CREATION,
      data: this.rooms.getRoomDataObject(roomId)
    })
  }
}

module.exports = SocketWrapper(Main);
