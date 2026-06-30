export function renderConnect4({ paint, Piece }) {
  return (
    <g>
      <rect x="24" y="18" width="112" height="80" rx="9" fill="#0d2d53" opacity="0.55" />
      <rect x="22" y="14" width="116" height="80" rx="9" fill={paint('bluePlastic')} stroke="#6cb6ff" strokeOpacity="0.34" />
      <rect x="27" y="19" width="106" height="70" rx="6" fill="none" stroke="#ffffff" strokeOpacity="0.15" />
      {Array.from({ length: 6 }, (_, r) => Array.from({ length: 7 }, (_, c) => {
        const filled = r > 2 || (r === 2 && c > 1 && c < 5)
        const color = (r + c) % 2 ? paint('p1Disc') : paint('p2Disc')
        return (
          <g key={`${r}-${c}`}>
            <circle cx={38 + c * 14} cy={27 + r * 11} r="5.5" fill="#07111c" opacity="0.95" />
            {filled && <Piece x={38 + c * 14} y={27 + r * 11} r="5" fill={color} />}
          </g>
        )
      }))}
    </g>
  )
}
