export default {
  hint: 'Blue connects left-right · Red connects top-bottom',
  rules: {
    objective: 'Build an unbroken chain between your two colored sides before your opponent connects theirs.',
    bullets: [
      'Players alternate placing one stone on any empty hex.',
      'Player 1 connects the blue left and right sides.',
      'Player 2 connects the red top and bottom sides.',
      'Connected stones touch along hex edges, not just corners.',
      'Hex cannot end in a draw; one player will complete a connection.',
    ],
  },
}
