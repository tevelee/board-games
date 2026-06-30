import { FONT, INK } from './primitives.jsx'

export function renderSolitaire({ Card }) {
  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <Card key={i} x={36 + i * 22} y={29 + i * 3} rotate={i * 2 - 4} fill={i === 3 ? undefined : '#d94d43'}>
          {i === 3 ? <text x={48 + i * 22} y={54 + i * 3} fill={INK} fontSize="16" fontFamily={FONT} fontWeight="900">Q</text> : <path d={`M${47 + i * 22} ${50 + i * 3}L${58 + i * 22} ${38 + i * 3}L${69 + i * 22} ${50 + i * 3}Z`} fill="#f6ead0" opacity="0.9" />}
        </Card>
      ))}
    </>
  )
}
