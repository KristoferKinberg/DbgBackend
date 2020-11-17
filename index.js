const Rooms = require('./Rooms');
const Clients = require('./Clients');
const Websocket = require('./WebSocket');
const wsA = require('./webSocketsActions');
const { getRoomByAbbrv } = require('./helpers');

const WebSocket = new Websocket();
