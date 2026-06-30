import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'
import { FONT, GREEN, INK } from './primitives.jsx'

export function renderCards({ paint, Card, Piece }, kind = 'poker') {
  if (kind === 'set') {
    return (
      <>
        {[0, 1, 2].map(i => (
          <Card key={i} x={40 + i * 27} y={24 - i * 2} rotate={(i - 1) * 6} fill="#f7eed8">
            <ellipse cx={57 + i * 27} cy={49 - i * 2} rx="8" ry="16" fill={[P1_COLOR, P2_COLOR, GREEN][i]} opacity={i === 1 ? 0.45 : 0.85} />
          </Card>
        ))}
      </>
    )
  }

  if (kind === 'uno') {
    return (
      <>
        <Card x="46" y="24" rotate="-8" fill={P2_COLOR}>
          <ellipse cx="63" cy="49" rx="11" ry="18" fill="#ffffff" opacity="0.86" />
          <text x="63" y="54" fill={P2_COLOR} fontSize="17" fontFamily={FONT} fontWeight="900" textAnchor="middle">1</text>
        </Card>
        <Card x="78" y="18" rotate="8" fill={P1_COLOR}>
          <ellipse cx="95" cy="43" rx="11" ry="18" fill="#ffffff" opacity="0.86" />
          <text x="95" y="48" fill={P1_COLOR} fontSize="17" fontFamily={FONT} fontWeight="900" textAnchor="middle">7</text>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card x="43" y="27" rotate="-9" fill={kind === 'cribbage' ? '#f4e5c6' : undefined}>
        <text x="54" y="46" fill={P2_COLOR} fontSize="15" fontFamily={FONT} fontWeight="900">A</text>
        <path d="M58 57C50 51 61 43 66 52C71 43 82 51 74 57L66 66Z" fill={P2_COLOR} />
      </Card>
      <Card x="72" y="20" rotate="7" fill="#f8f0dc">
        <text x="83" y="39" fill={INK} fontSize="15" fontFamily={FONT} fontWeight="900">K</text>
        <path d="M93 49L101 57L93 65L85 57Z" fill={INK} />
      </Card>
      {kind === 'cribbage' ? (
        <g>
          <rect x="68" y="82" width="54" height="8" rx="4" fill="#7b5430" />
          {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={75 + i * 9} cy="86" r="1.6" fill="#2a1b12" />)}
          <Piece x="94" y="84" r="3" fill={paint('p1Disc')} />
          <Piece x="112" y="84" r="3" fill={paint('p2Disc')} />
        </g>
      ) : null}
    </>
  )
}
