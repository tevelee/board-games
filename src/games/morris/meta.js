export default {
  hint: 'Tap a node to place · Tap piece then target to move',
  rules: {
    objective: 'Make mills, remove enemy stones, and leave the opponent unable to play.',
    bullets: [
      'Place all 9 stones, then move one stone per turn.',
      'A mill is 3 of your stones in a row on connected board nodes.',
      'Making a mill removes one opponent stone that is not inside a mill.',
      'With exactly 3 stones left, you may jump to any empty node.',
      'Win when the opponent has fewer than 3 stones or no legal move.',
    ],
  },
}
