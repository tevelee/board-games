export function renderBlockPuzzle({ paint, Board, Grid, GemSquare }) {
  const blocks = [
    [0, 2, paint('greenDisc')], [0, 3, paint('greenDisc')],
    [1, 0, paint('goldDisc')], [1, 1, paint('p1Disc')], [1, 2, paint('greenDisc')], [1, 4, paint('p2Disc')], [1, 5, paint('p2Disc')], [1, 6, paint('p2Disc')],
    [2, 0, paint('goldDisc')], [2, 1, paint('goldDisc')], [2, 2, paint('goldDisc')],
    [3, 0, paint('goldDisc')], [3, 1, paint('p2Disc')], [3, 2, paint('p2Disc')],
    [4, 0, paint('goldDisc')], [4, 1, paint('p1Disc')], [4, 2, paint('p1Disc')], [4, 5, paint('p2Disc')], [4, 6, paint('p2Disc')],
    [5, 0, paint('goldDisc')], [5, 1, paint('p1Disc')], [5, 2, paint('p1Disc')], [5, 5, paint('p2Disc')], [5, 6, paint('p2Disc')],
  ]

  return (
    <Board x="28" y="9" w="104" h="92" rx="7" fill={paint('slate')} stroke="#665160">
      <Grid x="39" y="19" w="77" h="66" cols="7" rows="6" color="#5a4652" width="0.9" />
      {blocks.map(([row, col, fill], index) => (
        <GemSquare key={index} x={40 + col * 11} y={20 + row * 11} size="9.2" fill={fill} />
      ))}
      <g transform="translate(44 90) scale(0.62)">
        <GemSquare x="0" y="0" size="9.2" fill={paint('goldDisc')} />
        <GemSquare x="11" y="0" size="9.2" fill={paint('goldDisc')} />
        <GemSquare x="22" y="0" size="9.2" fill={paint('goldDisc')} />
        <GemSquare x="22" y="11" size="9.2" fill={paint('goldDisc')} />
      </g>
      <g transform="translate(86 90) scale(0.62)">
        <GemSquare x="0" y="0" size="9.2" fill={paint('greenDisc')} />
        <GemSquare x="11" y="0" size="9.2" fill={paint('greenDisc')} />
        <GemSquare x="11" y="11" size="9.2" fill={paint('greenDisc')} />
      </g>
    </Board>
  )
}
