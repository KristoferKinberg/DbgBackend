const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const { hostExtension } = require('./hostExtension');
const { clientExtension } = require('./clientExtension');
const clientIds = require('./clientIds');
const term = require( 'terminal-kit' ).terminal ;

class WebSocketClient {
  logTestSocketMessages = false;
  socketConnection;
  messageHandlers;
  clientId;

  constructor(type, clientIdIndex) {
    this.socketConnection = new WebSocket('ws://localhost:8080');

    const functionalityExtension = type === 'HOST'
      ? hostExtension(this.sendMessage)
      : clientExtension(this.sendMessage);

    this.socketConnection.on('open', this.onConnection);
    this.socketConnection.on('message', this.onMessage);

    Object.keys(functionalityExtension)
      .forEach(handlerName => this[handlerName] = functionalityExtension[handlerName]);

    this.addMessageHandlers({
      [wsA.CLIENT_CONNECTED]: this.onConnect,
    });
  }

  /**
   * Reconnect client
   * @param clientId
   */
  reconnect = ({ clientId }) => this.sendMessage({ type: wsA.RECONNECT, newId: clientId });

  join = ({ clientId }) => this.sendMessage({ type: wsA.JOIN_GAME, roomId: '54485' })

  /**
   * On socket connection
   * @param message
   */
  onConnection = (message) => {
    console.log(message);
    //console.log('open', message);
  };

  /**
   * On socket message
   * @param message
   */
  onMessage = (message) => {
    if (this.logTestSocketMessages) term.magenta(`Message: ${message}\n`)
    if (!message) return;

    this.runThroughMessageHandlers(message);
  }

  /**
   * When the client connects it assigns it's id
   * @param clientId
   * @returns {*}
   */
  onConnect = ({ clientId }) => this.clientId = clientId;

  /**
   * Runs through the message handlers
   * @param message
   */
  runThroughMessageHandlers = (message) => {
    const { type, ...data } = JSON.parse(message);

    if (!this.messageHandlers[type] && this.logTestSocketMessages)
      term.bold.yellow(`Unknown message type: ${type}`);
    if (this.messageHandlers[type]) this.messageHandlers[type](data)
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
