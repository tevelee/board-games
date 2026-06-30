import { BOARD_LAYOUTS } from './logic.js'

export default {
  hint: 'Tap a piece · Clone nearby or jump two cells',
  rules: {
    objective: 'Control more cells than your opponent when no moves remain.',
    bullets: [
      'Move to a neighboring cell to clone your piece.',
      'Jump two cells to move the original piece instead.',
      'After each move, adjacent enemy pieces convert to your color.',
      'If a player has no legal move, the turn passes.',
    ],
  },
  options: [
    {
      id: 'boardLayout',
      label: 'Board',
      defaultValue: 'classic',
      options: BOARD_LAYOUTS.map(layout => ({
        value: layout.id,
        label: layout.label,
      })),
    },
  ],
}
