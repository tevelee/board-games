import { PAPER } from './primitives.jsx'

export function renderMorris({ paint, Board, Piece }) {
  return (
    <Board x="28" y="10" w="104" h="88" rx="7" fill={paint('slate')} stroke="#47525d">
      {[0, 1, 2].map(i => {
        const inset = 10 + i * 14
        return <rect key={i} x={28 + inset} y={10 + inset} width={104 - inset * 2} height={88 - inset * 2} fill="none" stroke={PAPER} strokeOpacity="0.46" strokeWidth="1.4" />
      })}
      <path d="M80 20V48M80 60V88M38 54H66M94 54H122" stroke={PAPER} strokeOpacity="0.46" strokeWidth="1.4" />
      {[
        [38, 20, paint('p1Disc')], [80, 20, paint('p2Disc')], [122, 20, paint('p1Disc')],
        [52, 54, paint('goldDisc')], [108, 54, paint('p2Disc')], [80, 88, paint('p1Disc')],
      ].map(([x, y, fill], index) => <Piece key={index} x={x} y={y} r="5.8" fill={fill} />)}
    </Board>
  )
}
