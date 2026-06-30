import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'

export const GOLD = '#e3b341'
export const GREEN = '#3fb950'
export const INK = '#0d1117'
export const LINE = '#30363d'
export const PAPER = '#d8c7a4'
export const CARD = '#f6ead0'
export const FONT = 'Inter, ui-sans-serif, system-ui, sans-serif'

export function Grid({ x, y, w, h, cols, rows, color = '#352719', width = 1, majorEvery = 0 }) {
  const gx = Number(x)
  const gy = Number(y)
  const gw = Number(w)
  const gh = Number(h)
  const colCount = Number(cols)
  const rowCount = Number(rows)
  const strokeWidth = Number(width)
  const major = Number(majorEvery)
  return (
    <>
      {Array.from({ length: colCount + 1 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={gx + (gw / colCount) * i}
          y1={gy}
          x2={gx + (gw / colCount) * i}
          y2={gy + gh}
          stroke={color}
          strokeOpacity="0.74"
          strokeWidth={major && i % major === 0 ? strokeWidth * 1.8 : strokeWidth}
        />
      ))}
      {Array.from({ length: rowCount + 1 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1={gx}
          y1={gy + (gh / rowCount) * i}
          x2={gx + gw}
          y2={gy + (gh / rowCount) * i}
          stroke={color}
          strokeOpacity="0.74"
          strokeWidth={major && i % major === 0 ? strokeWidth * 1.8 : strokeWidth}
        />
      ))}
    </>
  )
}

export function HexCell({ cx, cy, r = 7, fill = '#1f2932', stroke = '#46515d' }) {
  const hx = Number(cx)
  const hy = Number(cy)
  const hr = Number(r)
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 6 + i * Math.PI / 3
    return `${hx + Math.cos(angle) * hr},${hy + Math.sin(angle) * hr}`
  }).join(' ')
  return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1" />
}

export function XMark({ x, y, size = 10, color = P1_COLOR, opacity = 1 }) {
  const mx = Number(x)
  const my = Number(y)
  const ms = Number(size)
  return (
    <path
      d={`M${mx - ms / 2} ${my - ms / 2}L${mx + ms / 2} ${my + ms / 2}M${mx + ms / 2} ${my - ms / 2}L${mx - ms / 2} ${my + ms / 2}`}
      stroke={color}
      strokeWidth="3.4"
      strokeLinecap="round"
      opacity={opacity}
    />
  )
}

export function OMark({ x, y, size = 12, color = P2_COLOR, opacity = 1 }) {
  return <circle cx={Number(x)} cy={Number(y)} r={Number(size) / 2} fill="none" stroke={color} strokeWidth="3.4" opacity={opacity} />
}

export function NumberTile({ x, y, value, fill, text = INK, w = 29, h = 29 }) {
  const tx = Number(x)
  const ty = Number(y)
  const tw = Number(w)
  const th = Number(h)
  const valueText = String(value)
  return (
    <g>
      <rect x={tx + 2} y={ty + 3} width={tw} height={th} rx="5" fill="#020409" opacity="0.28" />
      <rect x={tx} y={ty} width={tw} height={th} rx="5" fill={fill} />
      <rect x={tx + 3} y={ty + 3} width={tw - 6} height={th - 6} rx="3" fill="#ffffff" opacity="0.12" />
      <text
        x={tx + tw / 2}
        y={ty + th / 2 + 5}
        fill={text}
        fontSize={valueText.length > 3 ? 9 : valueText.length > 2 ? 11 : valueText.length > 1 ? 13 : 15}
        fontFamily={FONT}
        fontWeight="900"
        textAnchor="middle"
      >
        {valueText}
      </text>
    </g>
  )
}

// Board, Piece, Card, CheckeredBoard, and GemSquare paint their fills via the
// per-instance gradient ids created in GameThumbnail (see `paint`), so they
// are built by a factory rather than exported directly.
export function createPaintedPrimitives(paint) {
  function Board({ x = 26, y = 12, w = 108, h = 84, rx = 8, fill = paint('wood'), stroke = '#6b4a2c', children }) {
    const bx = Number(x)
    const by = Number(y)
    const bw = Number(w)
    const bh = Number(h)
    const br = Number(rx)
    return (
      <g>
        <rect x={bx + 3} y={by + 5} width={bw} height={bh} rx={br} fill="#020409" opacity="0.34" />
        <rect x={bx} y={by} width={bw} height={bh} rx={br} fill={fill} stroke={stroke} strokeWidth="1.2" />
        <rect x={bx + 2} y={by + 2} width={bw - 4} height={bh - 4} rx={Math.max(br - 2, 2)} fill="none" stroke="#ffffff" strokeOpacity="0.12" />
        {children}
      </g>
    )
  }

  function Piece({ x, y, r = 6, fill = paint('p1Disc'), stroke = '#ffffff', opacity = 1 }) {
    const px = Number(x)
    const py = Number(y)
    const pr = Number(r)
    return (
      <g opacity={opacity}>
        <ellipse cx={px} cy={py + pr * 0.72} rx={pr * 0.9} ry={pr * 0.34} fill="#020409" opacity="0.34" />
        <circle cx={px} cy={py} r={pr} fill={fill} stroke={stroke} strokeOpacity="0.18" strokeWidth="0.9" />
        <circle cx={px - pr * 0.35} cy={py - pr * 0.36} r={pr * 0.34} fill="#ffffff" opacity="0.26" />
      </g>
    )
  }

  function Card({ x, y, w = 34, h = 50, rotate = 0, fill = CARD, stroke = '#ffffff', children }) {
    const cx = Number(x)
    const cy = Number(y)
    const cw = Number(w)
    const ch = Number(h)
    const cr = Number(rotate)
    return (
      <g transform={`rotate(${cr} ${cx + cw / 2} ${cy + ch / 2})`}>
        <rect x={cx + 3} y={cy + 5} width={cw} height={ch} rx="5" fill="#020409" opacity="0.32" />
        <rect x={cx} y={cy} width={cw} height={ch} rx="5" fill={fill} stroke={stroke} strokeOpacity="0.34" />
        <rect x={cx + 3} y={cy + 3} width={cw - 6} height={ch - 6} rx="3" fill="none" stroke="#ffffff" strokeOpacity="0.32" />
        {children}
      </g>
    )
  }

  function CheckeredBoard({ size = 11, x = 36, y = 12, dark = '#28323b', light = '#a87b4a' }) {
    const cell = Number(size)
    const bx = Number(x)
    const by = Number(y)
    return (
      <Board x={bx - 4} y={by - 4} w={cell * 8 + 8} h={cell * 8 + 8} rx={6} fill="#513820" stroke="#8a6137">
        {Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={bx + c * cell}
            y={by + r * cell}
            width={cell}
            height={cell}
            fill={(r + c) % 2 ? dark : light}
            opacity={(r + c) % 2 ? 1 : 0.92}
          />
        )))}
      </Board>
    )
  }

  function GemSquare({ x, y, size = 10, fill = paint('goldDisc') }) {
    const gx = Number(x)
    const gy = Number(y)
    const gs = Number(size)
    return (
      <g>
        <rect x={gx + 1.3} y={gy + 2} width={gs} height={gs} rx="2.2" fill="#020409" opacity="0.32" />
        <rect x={gx} y={gy} width={gs} height={gs} rx="2" fill="#b8873e" />
        <rect x={gx + 1.2} y={gy + 1.2} width={gs - 2.4} height={gs - 2.4} rx="1.3" fill={fill} />
        <path
          d={`M${gx + 2.2} ${gy + 2.2}H${gx + gs - 2.2}L${gx + gs - 4} ${gy + gs / 2}L${gx + gs - 2.2} ${gy + gs - 2.2}H${gx + 2.2}L${gx + 4} ${gy + gs / 2}Z`}
          fill="#ffffff"
          opacity="0.2"
        />
      </g>
    )
  }

  return { Board, Piece, Card, CheckeredBoard, GemSquare }
}
