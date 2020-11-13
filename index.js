const WebSocket = require('ws');
const Rooms = require('./Rooms');
const Clients = require('./Players');
const wsA = require('./webSocketsActions');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Clients();
const rooms = new Rooms(clients);

wss.on('connection', function connection(ws) {
  const clientId = clients.addPlayer(ws);
  ws.send(JSON.stringify({ type: wsA.PLAYER_CONNECTED, clientId }));

  ws.on('message', function incoming(message) {
    console.log('received: %s', JSON.parse(message));
    const { type, rest, clientId } = JSON.parse(message);

    if (type === wsA.CREATE_SERVER) {
      const roomId = rooms.addRoom(clientId);

      console.log(rooms.getRooms());

      ws.send(JSON.stringify({
        type: wsA.ROOM_CREATION,
        roomId,
      }));
    }

    if (type === wsA.JOIN_SERVER) {
      const { roomId, userId } = rest;

      rooms.addPlayer(roomId, userId );

      ws.send(JSON.stringify({
        type: wsA.PLAYER_JOINED,
        players: rooms.getPlayers(roomId)
      }));
    }
  });

  ws.send(JSON.stringify({ type: wsA.INIT }));
});

console.log('Is ready :D ');
