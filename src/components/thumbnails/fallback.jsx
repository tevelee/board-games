export function renderFallback({ paint, Board, Piece }) {
  return (
    <Board x="38" y="16" w="84" h="80" rx="8" fill={paint('slate')} stroke="#47525d">
      {[0, 1, 2, 3].map(i => <Piece key={i} x={58 + (i % 2) * 44} y={36 + Math.floor(i / 2) * 34} r="8" fill={[paint('p1Disc'), paint('p2Disc'), paint('goldDisc'), paint('greenDisc')][i]} />)}
    </Board>
  )
}
