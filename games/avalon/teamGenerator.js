const { characters, charNames, teamDivider, teams } = require('./characters');
const _ = require('lodash');

/**
 * Generate teams
 * @param numberOfPlayers
 * @param selectedGood
 * @param selectedEvil
 * @returns {*[]}
 */
const teamsGenerator = (numberOfPlayers, selectedGood = [], selectedEvil = []) => {
  const teamDivide = teamDivider[Object.keys(numberOfPlayers).length];
  const goodT = characters[teams.GOOD];
  const badT = characters[teams.EVIL];

  const lackingGood = teamDivide[teams.GOOD] - (1 + selectedGood.length);
  const lackingEvil = teamDivide[teams.EVIL] - (1 + selectedEvil.length);

  const getFillOuts = (shortage, team) => 'a'
    .repeat(shortage)
    .split('')
    .map(() => characters[team][charNames.minion]);

  return [
    goodT[charNames.merlin],
    badT[charNames.assassin],
    ...selectedGood,
    ...selectedEvil,
    ...getFillOuts(lackingGood, teams.GOOD),
    ...getFillOuts(lackingEvil, teams.EVIL),
  ];
};

/**
 * Generates player object
 * @param client
 * @param players
 * @param character
 * @param playerIndex
 */
const getPlayerObject = (client, players, character, playerIndex) => ({
  ...players,
  [client.id]: {
    client,
    character,
    playerIndex
  }
});

/**
 * Assigns character
 * @param client
 * @param clients
 * @param players
 * @param characters
 * @param playerOrder
 * @returns {*}
 */
const assignCharacter = ([client, ...clients], players, characters, playerOrder) => {
  const randomNumber = Math.floor(Math.random() * characters.length);
  const remainingCharacters = [...characters];
  const [ character ] = remainingCharacters.splice(randomNumber, 1);
  const [playerIndex, ...restOfPlayerOrder] = playerOrder
    ? playerOrder
    : _.shuffle(_.range(0, characters.length, 1));

  if (!clients.length) return getPlayerObject(client, players, character, playerIndex);

  return assignCharacter(clients, getPlayerObject(client, players, character, playerIndex), remainingCharacters, restOfPlayerOrder)
}

module.exports = {
  teamsGenerator,
  getPlayerObject,
  assignCharacter
};
