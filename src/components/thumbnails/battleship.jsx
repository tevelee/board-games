import { GOLD } from './primitives.jsx'

export function renderBattleship({ paint, Board, Grid }) {
  return (
    <Board x="29" y="10" w="102" h="90" rx="7" fill={paint('sea')} stroke="#1f6f8b">
      <Grid x="39" y="20" w="82" h="70" cols="7" rows="7" color="#82d2ef" width="0.7" />
      <rect x="49" y="41" width="38" height="10" rx="5" fill={paint('ship')} />
      <rect x="82" y="69" width="28" height="10" rx="5" fill={paint('shipRed')} />
      <circle cx="105" cy="41" r="6" fill={GOLD} />
      <path d="M100 41H110M105 36V46" stroke="#fff5c2" strokeWidth="2" strokeLinecap="round" />
    </Board>
  )
}
