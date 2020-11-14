const WebSocket = require('ws');
const Rooms = require('./Rooms');
const Clients = require('./Players');
const wsA = require('./webSocketsActions');
const { getRoomByAbbrv } = require('./helpers');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Clients();
const rooms = new Rooms(clients);

wss.on('connection', function connection(ws) {
  const clientId = clients.addClient(ws);
  ws.send(JSON.stringify({ type: wsA.CLIENT_CONNECTED, clientId }));

  ws.on('message', function incoming(message) {
    if (!message) return;

    const { type, ...rest } = JSON.parse(message);

    if (type === wsA.RECONNECT) {
      const clientsObj = clients.reconnectClient(rest.clientId, rest.newId);
    }

    if (type === wsA.CREATE_SERVER) {
      const roomId = rooms.addRoom(rest.clientId);

      console.log('this is the rooms: ', rooms.getRoomsIds());

      return ws.send(JSON.stringify({
        type: wsA.ROOM_CREATION,
        roomId: rest.clientId,
      }));
    }

    if (type === wsA.JOIN_GAME) {
      const { roomId: roomAbbrv, clientId } = rest;
      const roomId = getRoomByAbbrv(roomAbbrv, rooms.getRoomsIds());

      rooms.addClientToRoom(roomId, clientId);
      console.log()

      return [roomId, ...rooms.getRoomClients(roomId)].forEach(clientId => {
        clients.getClient(clientId).socket.send(JSON.stringify({
          type: wsA.PLAYER_JOINED,
          players: rooms.getRoomClients(roomId)
        }));
      });
    }
  });
});

console.log('Is ready :D ');
