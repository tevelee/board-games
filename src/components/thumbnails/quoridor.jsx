import { GOLD } from './primitives.jsx'

export function renderQuoridor({ paint, Board, Grid, Piece }) {
  return (
    <Board x="34" y="12" w="92" h="88" rx="7" fill={paint('paper')} stroke="#9b7447">
      <Grid x="48" y="25" w="64" h="58" cols="5" rows="5" color="#7d6749" width="0.9" />
      <Piece x="61" y="36" r="6" fill={paint('p1Disc')} />
      <Piece x="99" y="72" r="6" fill={paint('p2Disc')} />
      <path d="M75 25V62M86 46H112" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
    </Board>
  )
}
