import { P1_COLOR, P2_COLOR } from '../../games/shared/colors.js'

export function renderDots({ paint, Board }) {
  return (
    <Board x="30" y="12" w="100" h="84" rx="6" fill={paint('paper')} stroke="#a98152">
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => (
        <circle key={`${r}-${c}`} cx={44 + c * 15} cy={26 + r * 14} r="2.5" fill="#5e5344" />
      )))}
      <path d="M44 26H59V40H74V54H89V68H104" fill="none" stroke={P1_COLOR} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 26H89V40H104V54H119" fill="none" stroke={P2_COLOR} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="59" y="40" width="15" height="14" fill={P1_COLOR} opacity="0.17" />
      <rect x="89" y="40" width="15" height="14" fill={P2_COLOR} opacity="0.18" />
    </Board>
  )
}
