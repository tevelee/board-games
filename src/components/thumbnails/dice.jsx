import { INK } from './primitives.jsx'

export function renderDice() {
  const die = (x, y, rotate, fill, pips) => (
    <g key={`${x}-${y}`} transform={`rotate(${rotate} ${x + 18} ${y + 18})`}>
      <rect x={x + 3} y={y + 5} width="36" height="36" rx="7" fill="#020409" opacity="0.28" />
      <rect x={x} y={y} width="36" height="36" rx="7" fill={fill} stroke="#ffffff" strokeOpacity="0.34" />
      <rect x={x + 3} y={y + 3} width="30" height="30" rx="5" fill="#ffffff" opacity="0.12" />
      {pips.map(([px, py], i) => <circle key={i} cx={x + px} cy={y + py} r="3" fill={INK} opacity="0.82" />)}
    </g>
  )

  return (
    <>
      {die(46, 25, -8, '#f7eed8', [[10, 10], [26, 10], [18, 18], [10, 26], [26, 26]])}
      {die(80, 39, 10, '#e8d09b', [[10, 10], [26, 26], [10, 26], [26, 10]])}
    </>
  )
}
