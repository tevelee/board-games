export function renderMancala({ paint, Board, Piece }) {
  return (
    <Board x="21" y="25" w="118" h="62" rx="24" fill={paint('darkWood')} stroke="#9a7044">
      <ellipse cx="35" cy="56" rx="9" ry="22" fill="#1b140f" stroke="#8b6238" />
      <ellipse cx="125" cy="56" rx="9" ry="22" fill="#1b140f" stroke="#8b6238" />
      {[0, 1, 2, 3, 4, 5].map(i => <ellipse key={i} cx={52 + i * 11.3} cy="56" rx="6" ry="14" fill="#1b140f" stroke="#8b6238" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <Piece key={i} x={48 + i * 8.5} y={50 + (i % 3) * 5} r="2.6" fill={i % 2 ? paint('p1Disc') : paint('p2Disc')} />)}
    </Board>
  )
}
