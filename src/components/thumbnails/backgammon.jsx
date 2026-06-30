import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'
import { PAPER } from './primitives.jsx'

export function renderBackgammon({ paint, Board, Piece }) {
  return (
    <Board x="23" y="13" w="114" h="84" rx="9" fill={paint('darkWood')} stroke="#9a7044">
      <line x1="80" y1="17" x2="80" y2="93" stroke="#57381f" strokeWidth="5" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <path d={`M${29 + i * 17} 17L${37 + i * 17} 53L${45 + i * 17} 17Z`} fill={i % 2 ? P2_COLOR : PAPER} opacity="0.78" />
          <path d={`M${29 + i * 17} 93L${37 + i * 17} 57L${45 + i * 17} 93Z`} fill={i % 2 ? PAPER : P1_COLOR} opacity="0.78" />
        </g>
      ))}
      {[38, 48, 100, 110].map((x, i) => <Piece key={i} x={x} y={i < 2 ? 25 : 84} r="5" fill={i % 2 ? paint('p2Disc') : paint('p1Disc')} />)}
    </Board>
  )
}
