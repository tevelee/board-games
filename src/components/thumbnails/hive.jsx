export function renderHive({ paint, HexCell }) {
  const tiles = [
    [65, 43, paint('goldDisc'), '#5f4317', 'M60 43H70M65 38V48'],
    [91, 43, paint('whiteStone'), '#38424d', 'M86 42C89 38 94 38 97 42M88 48H95'],
    [78, 65, paint('greenDisc'), '#12351d', 'M73 65H83M78 60L83 69M78 60L73 69'],
    [104, 65, paint('p2Disc'), '#681a16', 'M99 65H109M104 60V70'],
    [52, 65, paint('p1Disc'), '#123760', 'M47 70C50 60 55 60 58 70'],
  ]
  return (
    <g>
      {tiles.map(([cx, cy, fill, stroke, mark], index) => (
        <g key={index}>
          <ellipse cx={cx} cy={cy + 12} rx="13" ry="4" fill="#020409" opacity="0.28" />
          <HexCell cx={cx} cy={cy} r="15" fill={fill} stroke="#f4e6b8" />
          <path d={mark} stroke={stroke} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.82" />
        </g>
      ))}
    </g>
  )
}
