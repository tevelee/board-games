import { GOLD } from './primitives.jsx'

export function render2048({ Board, NumberTile }) {
  const tiles = [
    [45, 18, '2', '#eee4da', '#776e65'], [78, 18, '4', '#ede0c8', '#776e65'],
    [45, 51, '128', '#f67c5f', '#f9f6f2'], [78, 51, '2048', '#edc22e', '#f9f6f2'],
  ]
  return (
    <Board x="36" y="12" w="88" h="88" rx="8" fill="#4b4139" stroke="#75685c">
      <rect x="43" y="16" width="74" height="74" rx="7" fill="#72665d" opacity="0.74" />
      {tiles.map(([x, y, value, fill, text]) => <NumberTile key={value} x={x} y={y} value={value} fill={fill} text={text} />)}
    </Board>
  )
}

export function renderThrees({ paint, Board, NumberTile }) {
  const tiles = [
    [45, 18, '1', '#5aa9ff', '#ffffff'], [78, 18, '2', '#ff6f61', '#ffffff'],
    [45, 51, '3', '#f7f3e8', '#2f4050'], [78, 51, '6', '#f7f3e8', '#2f4050'],
  ]
  return (
    <Board x="36" y="12" w="88" h="88" rx="8" fill={paint('paper')} stroke="#9b7447">
      <rect x="43" y="16" width="74" height="74" rx="8" fill="#cfc1a4" opacity="0.72" />
      {tiles.map(([x, y, value, fill, text]) => <NumberTile key={value} x={x} y={y} value={value} fill={fill} text={text} />)}
      <path d="M105 35L111 41L105 47" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Board>
  )
}
