export function renderMastermind({ paint, Board, Piece }) {
  return (
    <Board x="38" y="12" w="84" h="88" rx="7" fill={paint('slate')} stroke="#47525d">
      {[0, 1, 2, 3].map(row => (
        <g key={row}>
          {[0, 1, 2, 3].map(col => <Piece key={col} x={55 + col * 11} y={29 + row * 14} r="4" fill={[paint('p1Disc'), paint('p2Disc'), paint('goldDisc'), paint('greenDisc')][(row + col) % 4]} />)}
          {[0, 1, 2, 3].map(col => <circle key={col} cx={103 + (col % 2) * 5} cy={25 + row * 14 + Math.floor(col / 2) * 5} r="1.8" fill={col < row ? '#e6edf3' : '#6e7681'} />)}
        </g>
      ))}
    </Board>
  )
}
