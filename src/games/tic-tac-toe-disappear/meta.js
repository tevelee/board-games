export default {
  hint: 'Each player keeps only three marks · Oldest mark fades next',
  rules: {
    objective: 'Make three in a row while each player has at most three marks on the board.',
    bullets: [
      'Players alternate placing one mark in an empty square.',
      'After your third mark is already in play, placing a new mark removes your oldest mark.',
      'The faint ring marks the oldest mark that will disappear next.',
      'The game continues until someone makes three in a row.',
    ],
  },
}
