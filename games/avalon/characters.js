const GOOD = 'GOOD';
const EVIL = 'EVIL';

const charNames = {
  merlin: 'merlin',
  percival: 'percival',
  minion: 'minion',
  servantOfMerlin: 'servantOfMerlin',
  morgana: 'morgana',
  mordred: 'mordred',
  assassin: 'assassin',
  oberon: 'oberon',
  minionOfMordred: 'minionOfMordred',
}

const characters = {
  [GOOD]: {
    [charNames.merlin]: {
      name: 'Merlin',
      team: GOOD,
    },
    [charNames.percival]: {
      name: 'Percival',
      team: GOOD,
    },
    [charNames.minion]: {
      name: 'Loyal servant of Merlin',
      team: GOOD,
    },
  },
  [EVIL]: {
    [charNames.morgana]: {
      name: 'Morgana',
      team: EVIL
    },
    [charNames.mordred]: {
      name: 'Mordred',
      team: EVIL
    },
    [charNames.assassin]: {
      name: 'Assassin',
      team: EVIL
    },
    [charNames.oberon]: {
      name: 'Oberon',
      team: EVIL
    },
    [charNames.minion]: {
      name: 'Minion of Mordred',
      team: EVIL
    }
  }
};

const teamDivider = {
  5: {
    [GOOD]: 3,
    [EVIL]: 2,
  },
  6: {
    [GOOD]: 4,
    [EVIL]: 2
  },
  7: {
    [GOOD]: 4,
    [EVIL]: 3,
  },
  8: {
    [GOOD]: 5,
    [EVIL]: 3,
  },
  9: {
    [GOOD]: 6,
    [EVIL]: 3,
  },
  10: {
    [GOOD]: 6,
    [EVIL]: 4,
  }
};

module.exports = {
  charNames,
  characters,
  teamDivider
}
