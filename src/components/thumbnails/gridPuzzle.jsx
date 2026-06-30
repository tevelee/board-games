import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'
import { FONT } from './primitives.jsx'

export function renderGridPuzzle({ paint, Board, Grid }, kind = 'nonogram') {
  if (kind === 'nonogram') {
    const filled = new Set(['0-2', '1-1', '1-2', '1-3', '2-2', '3-0', '3-2', '3-4', '4-2'])
    return (
      <Board x="34" y="10" w="92" h="90" rx="6" fill={paint('paper')} stroke="#9b7447">
        {[1, 3, 1, 5, 1].map((value, i) => (
          <text key={`top-${i}`} x={61 + i * 10} y="26" fill="#6a5438" fontSize="7" fontFamily={FONT} fontWeight="900" textAnchor="middle">{value}</text>
        ))}
        {[1, 3, 1, 3, 1].map((value, i) => (
          <text key={`left-${i}`} x="49" y={41 + i * 10} fill="#6a5438" fontSize="7" fontFamily={FONT} fontWeight="900" textAnchor="middle">{value}</text>
        ))}
        {Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={56 + c * 10}
            y={32 + r * 10}
            width="9"
            height="9"
            rx="0.8"
            fill={filled.has(`${r}-${c}`) ? P1_COLOR : '#eadfcb'}
            stroke="#9d8664"
            strokeWidth="0.55"
          />
        )))}
      </Board>
    )
  }

  const cells = Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, c) => {
    if (kind === 'crossword') return (r + c) % 5 === 0 || (r === 0 && c > 3) || (c === 0 && r > 3)
    if (kind === 'minesweeper') return (r + c) % 6 === 0
    return (r === c && r % 2 === 0) || (r + c) % 4 === 0
  }))

  return (
    <Board x="34" y="10" w="92" h="90" rx="6" fill={kind === 'minesweeper' ? paint('metal') : paint('paper')} stroke={kind === 'minesweeper' ? '#65707c' : '#9b7447'}>
      {cells.flatMap((row, r) => row.map((active, c) => (
        <rect
          key={`${r}-${c}`}
          x={45 + c * 10}
          y={20 + r * 10}
          width="9"
          height="9"
          rx={kind === 'minesweeper' ? 1.5 : 0.8}
          fill={kind === 'crossword' && active ? '#1a2027' : active ? P1_COLOR : kind === 'minesweeper' ? '#38414b' : '#eadfcb'}
          stroke={kind === 'minesweeper' ? '#222b33' : '#9d8664'}
          strokeWidth="0.5"
          opacity={kind === 'nonogram' || active ? 1 : 0.84}
        />
      )))}
      {kind === 'sudoku' && (
        <>
          <Grid x="45" y="20" w="70" h="70" cols="7" rows="7" color="#7d6749" width="0.5" />
          <text x="80" y="66" fill={P2_COLOR} fontSize="27" fontFamily={FONT} fontWeight="800" textAnchor="middle">9</text>
        </>
      )}
      {kind === 'crossword' && (
        <>
          <text x="57" y="38" fill="#4a3b2a" fontSize="8" fontFamily={FONT} fontWeight="800">1</text>
          <text x="86" y="58" fill="#4a3b2a" fontSize="8" fontFamily={FONT} fontWeight="800">2</text>
        </>
      )}
      {kind === 'minesweeper' && (
        <>
          <circle cx="65" cy="50" r="4.5" fill="#101820" />
          <path d="M90 41V62M90 43L104 48L90 54" fill={P2_COLOR} stroke={P2_COLOR} strokeLinecap="round" strokeLinejoin="round" />
          <text x="70" y="81" fill={P1_COLOR} fontSize="13" fontFamily={FONT} fontWeight="900">2</text>
        </>
      )}
    </Board>
  )
}
