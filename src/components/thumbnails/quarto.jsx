export function renderQuarto({ paint, Board, Grid }) {
  return (
    <Board x="36" y="13" w="88" h="86" rx="7" fill={paint('wood')} stroke="#8f6638">
      <Grid x="49" y="26" w="62" h="58" cols="4" rows="4" color="#6a4928" width="0.9" />
      <rect x="59" y="36" width="9" height="22" rx="2" fill={paint('p1Disc')} />
      <circle cx="87" cy="48" r="7" fill={paint('p2Disc')} />
      <path d="M94 76L102 61L110 76Z" fill={paint('goldDisc')} />
      <rect x="60" y="66" width="12" height="12" fill={paint('greenDisc')} />
    </Board>
  )
}
