import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'

export function renderHex({ paint, Board, HexCell, Piece }) {
  return (
    <Board x="30" y="11" w="100" h="88" rx="7" fill={paint('slate')} stroke="#47525d">
      <path d="M49 20H111M49 88H111" stroke={P1_COLOR} strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      <path d="M39 33L55 84M121 33L105 84" stroke={P2_COLOR} strokeWidth="3" strokeLinecap="round" opacity="0.72" />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => (
        <HexCell
          key={`${r}-${c}`}
          cx={55 + c * 13 + r * 6.5}
          cy={28 + r * 12}
          r="7"
          fill={(r + c) % 2 ? '#2f3b45' : '#1d2831'}
          stroke="#72808c"
        />
      )))}
      <Piece x="73" y="50" r="6" fill={paint('p1Disc')} />
      <Piece x="92" y="62" r="6" fill={paint('p2Disc')} />
    </Board>
  )
}
