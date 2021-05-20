const teamsGenerator = require('./teamGenerator');

const getPlayerObject = (client, players, character) => ({
  ...players,
  [client.id]: {
    client,
    character,
  }
});

const assign = ([client, ...clients], players, characters) => {
  const randomNumber = Math.floor(Math.random() * characters.length);
  const remainingCharacters = [...characters];
  const [ character ] = remainingCharacters.splice(randomNumber, 1);

  if (!clients.length) return getPlayerObject(client, players, character);

  return assign(clients, getPlayerObject(client, players, character), remainingCharacters)
}

class Avalon {
  clients;
  players;
  room;
  characters;

  constructor(clients, room) {
    console.log('Avalon games started');

    this.clients = clients;
    this.players = this.assignCharacters();
    console.log(this.players);
  }

  assignCharacters = (clients) => {
    const teams = teamsGenerator(Object.keys(this.clients));
    return assign(Object.values(this.clients), {}, teams);
  }
}

module.exports = Avalon;
