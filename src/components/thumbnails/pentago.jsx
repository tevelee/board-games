import { GOLD } from './primitives.jsx'

export function renderPentago({ paint, Board, Piece }) {
  return (
    <Board x="35" y="12" w="90" h="88" rx="7" fill={paint('wood')} stroke="#8f6638">
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={43 + (i % 2) * 36} y={20 + Math.floor(i / 2) * 34} width="32" height="30" rx="5" fill="#e1b879" stroke="#8a6035" />
      ))}
      {[50, 66, 88, 105, 73, 93].map((x, i) => <Piece key={i} x={x} y={31 + (i % 3) * 22} r="4.8" fill={i % 2 ? paint('p2Disc') : paint('p1Disc')} />)}
      <path d="M114 48A16 16 0 0 1 101 73" fill="none" stroke={GOLD} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M101 73L108 73L104 67" fill="none" stroke={GOLD} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </Board>
  )
}
