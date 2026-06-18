import { useState, useRef, useCallback } from 'react'
import GameCanvas from './components/GameCanvas'
import MorrisBoard from './components/MorrisBoard'
import Header from './components/Header'
import BottomBar from './components/BottomBar'
import { HUMAN, BOT } from './game/gomoku/logic'

const INIT_STATE = {
  current: HUMAN,
  winner:  null,
  busy:    false,
  scores:  { p1: 0, p2: 0 },
}

function deriveStatus(uiState, mode) {
  const { current, winner, busy } = uiState
  const pvp = mode === 'pvp'
  if (winner === HUMAN) return [pvp ? 'Player 1 wins! 🎉' : 'You win! 🎉', 'win']
  if (winner === BOT)   return [pvp ? 'Player 2 wins! 🎉' : 'AI wins!',    pvp ? 'win' : 'lose']
  if (busy)             return ['Thinking…', 'muted']
  if (pvp)              return current === HUMAN ? ["Player 1's turn", 'p1'] : ["Player 2's turn", 'p2']
  return ['Your turn', 'p1']
}

export default function App() {
  const [game,       setGame]       = useState('gomoku')
  const [mode,       setMode]       = useState('pvai')
  const [difficulty, setDifficulty] = useState('medium')
  const [gomokuUI,   setGomokuUI]   = useState(INIT_STATE)
  const [morrisUI,   setMorrisUI]   = useState(INIT_STATE)
  const gomokuRef = useRef(null)
  const morrisRef = useRef(null)

  const uiState  = game === 'gomoku' ? gomokuUI  : morrisUI
  const setUI    = game === 'gomoku' ? setGomokuUI : setMorrisUI
  const activeRef = game === 'gomoku' ? gomokuRef : morrisRef

  const handleNewGame = useCallback(() => {
    activeRef.current?.reset()
    setUI(s => ({ ...INIT_STATE, scores: s.scores }))
  }, [activeRef, setUI])

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    setTimeout(() => {
      activeRef.current?.reset()
      setUI(s => ({ ...INIT_STATE, scores: s.scores }))
    }, 0)
  }, [activeRef, setUI])

  const handleGameChange = useCallback((newGame) => {
    setGame(newGame)
  }, [])

  const [statusText, statusClass] = deriveStatus(uiState, mode)

  return (
    <div className="app">
      <Header
        game={game}
        onGameChange={handleGameChange}
        statusText={statusText}
        statusClass={statusClass}
      />

      <div className="canvas-wrap">
        <div className="game-layer" style={{
          visibility: game === 'gomoku' ? 'visible' : 'hidden',
          pointerEvents: game === 'gomoku' ? 'auto' : 'none',
        }}>
          <GameCanvas
            ref={gomokuRef}
            mode={mode}
            difficulty={difficulty}
            onStateChange={setGomokuUI}
          />
          {game === 'gomoku' && (
            <div className="hint">Drag · Pinch/scroll to zoom · Tap to place</div>
          )}
        </div>

        <div className="game-layer" style={{
          visibility: game === 'morris' ? 'visible' : 'hidden',
          pointerEvents: game === 'morris' ? 'auto' : 'none',
        }}>
          <MorrisBoard
            ref={morrisRef}
            mode={mode}
            difficulty={difficulty}
            onStateChange={setMorrisUI}
          />
          {game === 'morris' && (
            <div className="hint morris-hint">Tap a node to place · Tap piece then target to move</div>
          )}
        </div>
      </div>

      <BottomBar
        mode={mode}
        difficulty={difficulty}
        scores={uiState.scores}
        onModeChange={handleModeChange}
        onDifficultyChange={setDifficulty}
        onNewGame={handleNewGame}
      />
    </div>
  )
}
