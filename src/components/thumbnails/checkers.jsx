import { GOLD } from './primitives.jsx'

export function renderCheckers({ paint, CheckeredBoard, Piece }, kind = 'checkers') {
  return (
    <>
      <CheckeredBoard x="36" y="12" size="11" dark="#1f2a32" light={kind === 'chess' ? '#c4a36f' : '#8b6b47'} />
      {kind === 'chess' ? (
        <>
          <path d="M64 77H101M70 77L75 50L84 66L94 43L98 77" fill={paint('p1Disc')} stroke="#d8ecff" strokeOpacity="0.24" strokeWidth="1.2" />
          <circle cx="94" cy="42" r="5.8" fill={paint('p1Disc')} />
          <path d="M83 34V50M75 42H91" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <Piece x="52" y="32" r="5" fill={paint('p2Disc')} />
          <Piece x="108" y="87" r="5" fill={paint('p2Disc')} />
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map(i => <Piece key={`r-${i}`} x={47 + i * 22} y={27 + (i % 2) * 11} r="6.2" fill={paint('p2Disc')} />)}
          {[0, 1, 2, 3].map(i => <Piece key={`b-${i}`} x={58 + i * 22} y={83 - (i % 2) * 11} r="6.2" fill={paint('p1Disc')} />)}
          {kind === 'draughts' && <path d="M80 45L86 53L80 61L74 53Z" fill={GOLD} opacity="0.9" />}
        </>
      )}
    </>
  )
}
