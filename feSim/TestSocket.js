const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const hostExtension = require('./hostExtension');
const clientExtension = require('./clientExtension');
const clientIds = require('./clientIds');

class WebSocketClient {
  socketConnection;
  messageHandlers;
  clientId;

  constructor(type, clientIdIndex) {
    this.socketConnection = new WebSocket('ws://localhost:8080');
    this.clientId = `cid-${clientIds[clientIdIndex]}`;

    const functionalityExtension = type === 'HOST'
      ? hostExtension(this.sendMessage)
      : clientExtension(this.sendMessage);

    this.socketConnection.on('open', this.onConnection);
    this.socketConnection.on('message', this.onMessage);

    Object.keys(functionalityExtension)
      .forEach(handlerName => this[handlerName] = functionalityExtension[handlerName]);

    this.addMessageHandlers({
      [wsA.CLIENT_CONNECTED]: this.reconnect,
    });
  }

  /**
   * Reconnect client
   * @param clientId
   */
  reconnect = ({ clientId }) => this.sendMessage({ type: wsA.RECONNECT, newId: clientId });

  /**
   * On socket connection
   * @param message
   */
  onConnection = (message) => {
    //console.log('open', message);
  };

  /**
   * On socket message
   * @param message
   */
  onMessage = (message) => {
    console.log('Message: ', message, '\n\n');
    if (!message) return;

    this.runThroughMessageHandlers(message);
  }

  /**
   * Runs through the message handlers
   * @param socket
   * @param message
   */
  runThroughMessageHandlers = (message) => {
    const { type, ...data } = JSON.parse(message);

    if (this.messageHandlers[type]){
      console.log(type);
      this.messageHandlers[type](data)
    }
  };

  /**
   * Send message
   * @param msg
   */
  sendMessage = (msg) => {
    const message = JSON.stringify({ ...msg, clientId: this.clientId });
    console.log('Message: ', message);
    this.socketConnection.send(message);
  };

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

module.exports = WebSocketClient;
