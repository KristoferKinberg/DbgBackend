const WebSocket = require('ws');
const wsA = require('../webSocketsActions');
const { hostExtension } = require('./hostExtension');
const { clientExtension } = require('./clientExtension');
const clientIds = require('./clientIds');
const term = require( 'terminal-kit' ).terminal ;
const aA = require('../games/avalon/avalonActions');
const { teams } = require('../games/avalon/characters');

class WebSocketClient {
  logTestSocketMessages = false;
  socketConnection;
  messageHandlers;
  clientId;
  roomId;
  playersInRoom;
  isKing;
  character;
  registerOnConnectionObject;
  playersToSelect;

  constructor(type, clientIdIndex, registerOnConnectionObject = false) {
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
      [wsA.SUCCESSFULLY_JOINED]: this.onConnectToRoom,
      [aA.ASSIGNED_CHARACTER]: this.handleAssignedCharacter,
      [aA.ASSIGNED_KING]: this.handleAssignedKing,
      [aA.REQUEST_VOTE_FOR_ASSIGNED_PLAYERS]: this.handleVoteRequest,
      [aA.REQUEST_VOTE_FOR_MISSION]: this.handleMissionVoteRequest,
    });

    if (registerOnConnectionObject){
      this.registerOnConnectionObject = registerOnConnectionObject;
    }
  }

  _registerOnConnectionObject = () => {
    this.registerOnConnectionObject(this);
  }

  get isKing() {
    return this.isKing;
  }

  /**
   * Reconnect client
   * @param clientId
   */
  reconnect = ({ clientId }) => this.sendMessage({ type: wsA.RECONNECT, newId: clientId });

  /**
   * Rungs when this get confirmation from server that joining game was successful
   * @param roomId
   * @param players
   */
  onConnectToRoom = ({ roomId, players }) => {
    this.roomId = roomId;
    this.playersInRoom = players;
  }

  join = ({ clientId }) => this.sendMessage({ type: wsA.JOIN_GAME, roomId: '54485' })

  /**
   * On socket connection
   * @param message
   */
  onConnection = (message) => {
    if (message) console.log(message);
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

  //handleAssignedCharacter = ({ character }) => {
  handleAssignedCharacter = (character) => {
    this.character = character;

    term.cyan(`Character assigned: ${character.name} of team ${character.team}\n`);
  }

  handleAssignedKing = ({ kingId, playersToSelect }) => {
    this.clientId === kingId
      ? this.isKing = true
      : this.isKing = false;

    this.playersToSelect = playersToSelect;

    term.cyan(`King assigned: ${kingId}\n\n`);
  }

  handleVoteRequest = ({ kingsNominees }) => {
    //term.cyan(`Client recieved voterequest for ${kingsNominees}`);
  };

  handleMissionVoteRequest = (data) => {
    console.log('Ball did reached its target', data);
    this.sendMessage({
      type: aA.VOTE_FOR_MISSION,
      roomId: this.roomId,
      voteForSuccess: true,
    })
  }
}

module.exports = WebSocketClient;
