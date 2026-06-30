export function renderLineBoard({ paint, Board, Grid, Piece }, kind = 'gomoku') {
  const isGo = kind === 'go'
  const stones = isGo
    ? [
        [62, 42, paint('blackStone')], [82, 54, paint('whiteStone')],
        [102, 65, paint('blackStone')], [74, 76, paint('whiteStone')],
      ]
    : [
        [54, 42, paint('p1Disc')], [68, 50, paint('p1Disc')], [82, 58, paint('p1Disc')],
        [96, 66, paint('p1Disc')], [110, 74, paint('p1Disc')], [104, 39, paint('p2Disc')],
        [86, 39, paint('p2Disc')], [104, 57, paint('p2Disc')],
      ]

  return (
    <Board x="28" y="12" w="104" h="86" rx="7" fill={paint('wood')} stroke="#8f6638">
      <Grid x="42" y="24" w="76" h="60" cols="6" rows="6" color="#4b351f" />
      {[42, 80, 118].map(x => [28, 56, 84].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#4b351f" opacity="0.75" />
      )))}
      {stones.map(([x, y, fill], index) => <Piece key={index} x={x} y={y} r={isGo ? 6 : 5.6} fill={fill} />)}
    </Board>
  )
}
