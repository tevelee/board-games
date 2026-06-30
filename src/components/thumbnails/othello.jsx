export function renderOthello({ paint, Board, Grid, Piece }) {
  return (
    <Board x="31" y="10" w="98" h="88" rx="7" fill={paint('felt')} stroke="#2d6c49">
      <Grid x="41" y="20" w="78" h="68" cols="6" rows="6" color="#b5d7bc" width="0.8" />
      {[
        [72, 49, paint('p1Disc')], [88, 49, paint('p2Disc')],
        [72, 65, paint('p2Disc')], [88, 65, paint('p1Disc')],
        [104, 65, paint('p1Disc')], [56, 49, paint('p2Disc')],
      ].map(([x, y, fill], index) => <Piece key={index} x={x} y={y} r="7.5" fill={fill} />)}
    </Board>
  )
}
