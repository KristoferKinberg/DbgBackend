const { characters, charNames, teamDivider, teams } = require('./characters');

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

module.exports = teamsGenerator;
