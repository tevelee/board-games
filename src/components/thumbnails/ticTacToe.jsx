import { GOLD } from './primitives.jsx'

export function renderTicTacToe({ paint, Board, XMark, OMark }, kind = 'tictactoe') {
  return (
    <Board x="36" y="12" w="88" h="88" rx="7" fill={paint('slate')} stroke="#47525d">
      <path d="M65 24V88M95 24V88M48 45H112M48 67H112" stroke="#d8e4ed" strokeOpacity="0.42" strokeWidth="3.2" strokeLinecap="round" />
      {kind === 'ultimate' && (
        <g opacity="0.56">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => (
            <rect key={`${r}-${c}`} x={43 + c * 25} y={19 + r * 25} width="23" height="23" rx="2" fill="none" stroke={GOLD} strokeDasharray="2 3" />
          )))}
          <rect x="67" y="43" width="26" height="24" rx="3" fill="none" stroke={GOLD} strokeWidth="2" />
        </g>
      )}
      <XMark x="55" y="34" />
      <OMark x="80" y="56" />
      <XMark x="105" y="78" />
      <OMark x="55" y="78" opacity={kind === 'vanish' ? 0.26 : 1} />
      {kind === 'vanish' && <path d="M52 90H58" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />}
    </Board>
  )
}
