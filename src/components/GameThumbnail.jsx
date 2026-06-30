import { useId } from 'react'
import { P1_COLOR, P2_COLOR } from '../games/shared/colors.js'
import { GOLD, GREEN, Grid, HexCell, NumberTile, OMark, XMark, createPaintedPrimitives } from './thumbnails/primitives.jsx'
import { renderLineBoard } from './thumbnails/lineBoard.jsx'
import { renderMorris } from './thumbnails/morris.jsx'
import { renderOthello } from './thumbnails/othello.jsx'
import { renderConnect4 } from './thumbnails/connect4.jsx'
import { renderCheckers } from './thumbnails/checkers.jsx'
import { renderDots } from './thumbnails/dots.jsx'
import { renderTicTacToe } from './thumbnails/ticTacToe.jsx'
import { renderGridPuzzle } from './thumbnails/gridPuzzle.jsx'
import { renderBlockPuzzle } from './thumbnails/blockPuzzle.jsx'
import { renderBackgammon } from './thumbnails/backgammon.jsx'
import { render2048, renderThrees } from './thumbnails/numberTiles.jsx'
import { renderBattleship } from './thumbnails/battleship.jsx'
import { renderHex } from './thumbnails/hex.jsx'
import { renderHive } from './thumbnails/hive.jsx'
import { renderMancala } from './thumbnails/mancala.jsx'
import { renderCards } from './thumbnails/cards.jsx'
import { renderSolitaire } from './thumbnails/solitaire.jsx'
import { renderAtaxx } from './thumbnails/ataxx.jsx'
import { renderPentago } from './thumbnails/pentago.jsx'
import { renderQuarto } from './thumbnails/quarto.jsx'
import { renderQuoridor } from './thumbnails/quoridor.jsx'
import { renderMastermind } from './thumbnails/mastermind.jsx'
import { renderDice } from './thumbnails/dice.jsx'
import { renderFallback } from './thumbnails/fallback.jsx'

// Maps a catalog `visual` id to its thumbnail renderer. Each renderer takes
// the shared primitive bag (see thumbnails/primitives.jsx) and returns SVG
// content drawn inside the shared table/board frame below.
const RENDERERS = {
  gomoku: ctx => renderLineBoard(ctx, 'gomoku'),
  go: ctx => renderLineBoard(ctx, 'go'),
  morris: renderMorris,
  othello: renderOthello,
  connect4: renderConnect4,
  checkers: ctx => renderCheckers(ctx, 'checkers'),
  draughts: ctx => renderCheckers(ctx, 'draughts'),
  chess: ctx => renderCheckers(ctx, 'chess'),
  dots: renderDots,
  tictactoe: ctx => renderTicTacToe(ctx, 'tictactoe'),
  ultimate: ctx => renderTicTacToe(ctx, 'ultimate'),
  vanish: ctx => renderTicTacToe(ctx, 'vanish'),
  nonogram: ctx => renderGridPuzzle(ctx, 'nonogram'),
  'block-puzzle': renderBlockPuzzle,
  sudoku: ctx => renderGridPuzzle(ctx, 'sudoku'),
  crossword: ctx => renderGridPuzzle(ctx, 'crossword'),
  minesweeper: ctx => renderGridPuzzle(ctx, 'minesweeper'),
  backgammon: renderBackgammon,
  '2048': render2048,
  tiles: render2048,
  threes: renderThrees,
  battleship: renderBattleship,
  hex: ctx => renderHex(ctx, 'hex'),
  hive: renderHive,
  mancala: renderMancala,
  poker: ctx => renderCards(ctx, 'poker'),
  uno: ctx => renderCards(ctx, 'uno'),
  solitaire: renderSolitaire,
  cribbage: ctx => renderCards(ctx, 'cribbage'),
  set: ctx => renderCards(ctx, 'set'),
  ataxx: renderAtaxx,
  pentago: renderPentago,
  quarto: renderQuarto,
  quoridor: renderQuoridor,
  mastermind: renderMastermind,
  dice: renderDice,
}

export default function GameThumbnail({ type, className = '' }) {
  const base = `thumb-${useId().replace(/:/g, '')}`
  const paint = name => `url(#${base}-${name})`
  const ctx = { paint, Grid, HexCell, NumberTile, OMark, XMark, ...createPaintedPrimitives(paint) }
  const render = RENDERERS[type] ?? renderFallback

  return (
    <svg className={`tile-graphic ${className}`.trim()} viewBox="0 0 260 112" aria-hidden="true">
      <defs>
        <linearGradient id={`${base}-table`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17232b" />
          <stop offset="0.52" stopColor="#0d151c" />
          <stop offset="1" stopColor="#14100c" />
        </linearGradient>
        <radialGradient id={`${base}-tableLight`} cx="38%" cy="14%" r="88%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.48" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${base}-wood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8ad70" />
          <stop offset="0.48" stopColor="#b27a3f" />
          <stop offset="1" stopColor="#704622" />
        </linearGradient>
        <linearGradient id={`${base}-darkWood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f5732" />
          <stop offset="0.54" stopColor="#4f321d" />
          <stop offset="1" stopColor="#29180f" />
        </linearGradient>
        <linearGradient id={`${base}-slate`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#26313b" />
          <stop offset="0.56" stopColor="#18222b" />
          <stop offset="1" stopColor="#101820" />
        </linearGradient>
        <linearGradient id={`${base}-felt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a7345" />
          <stop offset="0.6" stopColor="#174d31" />
          <stop offset="1" stopColor="#0e2f20" />
        </linearGradient>
        <linearGradient id={`${base}-paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2e3c6" />
          <stop offset="0.58" stopColor="#d9bd88" />
          <stop offset="1" stopColor="#aa7c47" />
        </linearGradient>
        <linearGradient id={`${base}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7b8794" />
          <stop offset="0.62" stopColor="#3a4651" />
          <stop offset="1" stopColor="#1c252e" />
        </linearGradient>
        <linearGradient id={`${base}-sea`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#174868" />
          <stop offset="0.56" stopColor="#0e2f45" />
          <stop offset="1" stopColor="#081b2a" />
        </linearGradient>
        <linearGradient id={`${base}-bluePlastic`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f81f7" />
          <stop offset="0.58" stopColor="#1259b0" />
          <stop offset="1" stopColor="#0a3069" />
        </linearGradient>
        <radialGradient id={`${base}-p1Disc`} cx="32%" cy="24%" r="78%">
          <stop offset="0" stopColor="#cfe8ff" />
          <stop offset="0.32" stopColor={P1_COLOR} />
          <stop offset="1" stopColor="#1f6feb" />
        </radialGradient>
        <radialGradient id={`${base}-p2Disc`} cx="32%" cy="24%" r="78%">
          <stop offset="0" stopColor="#ffd1cc" />
          <stop offset="0.34" stopColor={P2_COLOR} />
          <stop offset="1" stopColor="#da3633" />
        </radialGradient>
        <radialGradient id={`${base}-goldDisc`} cx="32%" cy="24%" r="78%">
          <stop offset="0" stopColor="#fff4b8" />
          <stop offset="0.38" stopColor={GOLD} />
          <stop offset="1" stopColor="#9e6a03" />
        </radialGradient>
        <radialGradient id={`${base}-greenDisc`} cx="32%" cy="24%" r="78%">
          <stop offset="0" stopColor="#baffc7" />
          <stop offset="0.38" stopColor={GREEN} />
          <stop offset="1" stopColor="#238636" />
        </radialGradient>
        <radialGradient id={`${base}-blackStone`} cx="30%" cy="23%" r="78%">
          <stop offset="0" stopColor="#56616d" />
          <stop offset="0.38" stopColor="#161b22" />
          <stop offset="1" stopColor="#030507" />
        </radialGradient>
        <radialGradient id={`${base}-whiteStone`} cx="30%" cy="23%" r="78%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.46" stopColor="#dfe7ee" />
          <stop offset="1" stopColor="#8b949e" />
        </radialGradient>
        <linearGradient id={`${base}-ship`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9fb4c7" />
          <stop offset="1" stopColor="#536776" />
        </linearGradient>
        <linearGradient id={`${base}-shipRed`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9b93" />
          <stop offset="1" stopColor={P2_COLOR} />
        </linearGradient>
      </defs>
      <rect width="260" height="112" rx="8" fill={paint('table')} />
      <rect width="260" height="112" rx="8" fill={paint('tableLight')} />
      <ellipse cx="130" cy="102" rx="74" ry="8" fill="#020409" opacity="0.36" />
      <g transform="translate(50 0)">
        {render(ctx)}
      </g>
    </svg>
  )
}
