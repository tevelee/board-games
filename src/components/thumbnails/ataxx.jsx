import { GOLD } from './primitives.jsx'

export function renderAtaxx({ paint, Board, Piece }) {
  return (
    <Board x="35" y="11" w="90" h="90" rx="7" fill={paint('slate')} stroke="#47525d">
      {Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, c) => {
        const filled =
          (r === 0 && c === 0) || (r === 6 && c === 6) ||
          (r === 0 && c === 6) || (r === 6 && c === 0) ||
          (r === 2 && c > 2 && c < 5) || (r === 3 && c === 3)
        const fill = (r === 0 && c === 6) || (r === 6 && c === 0) || (r === 2 && c === 4) ? paint('p2Disc') : paint('p1Disc')
        return (
          <g key={`${r}-${c}`}>
            <rect x={43 + c * 10.5} y={19 + r * 10.5} width="9.5" height="9.5" rx="2" fill={(r + c) % 2 ? '#26313a' : '#172129'} stroke="#394652" strokeWidth="0.5" />
            {filled && <Piece x={47.75 + c * 10.5} y={23.75 + r * 10.5} r="3.8" fill={fill} />}
          </g>
        )
      }))}
      <path d="M79 52L91 40M79 52L68 63" fill="none" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M91 40L88 48M91 40L83 43" fill="none" stroke={GOLD} strokeWidth="2.3" strokeLinecap="round" />
    </Board>
  )
}
