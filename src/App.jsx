import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import BottomBar from './components/BottomBar'
import Launcher from './components/Launcher'
import GameHost from './components/GameHost'
import { createGameUiState, deriveStatus } from './game/runtime.js'
import { playableGameIds, playableGamesById } from './playableGames.jsx'

export default function App() {
  const [game,        setGame]        = useState(null)
  const [mode,        setMode]        = useState('pvai')
  const [difficulty,  setDifficulty]  = useState('medium')
  const [uiState,    setUiState]      = useState(createGameUiState)
  const [settingsByGame, setSettingsByGame] = useState({})
  const gameHostRef = useRef(null)
  const activeGame  = game ? playableGamesById[game] : null
  const activeSettings = getGameSettings(activeGame, game ? settingsByGame[game] : null)
  const activeMode = getGameMode(activeGame, mode)

  const handleNewGame = useCallback(() => {
    gameHostRef.current?.resetActive()
  }, [])

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode)
    setTimeout(() => gameHostRef.current?.resetActive(), 0)
  }, [])

  const handleUndo = useCallback(() => {
    gameHostRef.current?.undoActive()
  }, [])

  const handleSettingChange = useCallback((settingId, value) => {
    if (!game) return
    setSettingsByGame(settings => ({
      ...settings,
      [game]: {
        ...(settings[game] ?? {}),
        [settingId]: value,
      },
    }))
  }, [game])

  const handleLaunch = useCallback((newGame) => {
    if (playableGameIds.includes(newGame)) setGame(newGame)
  }, [])

  const handleShowLibrary = useCallback(() => {
    setGame(null)
  }, [])

  const [statusText, statusClass] = deriveStatus(uiState, activeMode)

  return (
    <div className="app">
      <Header
        gameTitle={activeGame?.title}
        inLibrary={!game}
        onLibrary={handleShowLibrary}
        statusText={statusText}
        statusClass={statusClass}
      />

      <div className="main-stage">
        <div className="launcher-layer" style={{
          visibility:    game ? 'hidden' : 'visible',
          pointerEvents: game ? 'none'   : 'auto',
        }}>
          <Launcher onLaunch={handleLaunch} />
        </div>

        <GameHost
          ref={gameHostRef}
          activeGameId={game}
          mode={activeMode}
          difficulty={difficulty}
          settings={activeSettings}
          onActiveStateChange={setUiState}
        />
      </div>

      {game && (
        <BottomBar
          mode={activeMode}
          difficulty={difficulty}
          scores={uiState.scores}
          hint={activeGame?.hint}
          gameModes={activeGame?.modes}
          scoreLabels={activeGame?.scoreLabels}
          gameOptions={activeGame?.options}
          gameSettings={activeSettings}
          onGameSettingChange={handleSettingChange}
          onModeChange={handleModeChange}
          onDifficultyChange={setDifficulty}
          onNewGame={handleNewGame}
          canUndo={!uiState.busy && uiState.historyLen > 0}
          onUndo={handleUndo}
        />
      )}
    </div>
  )
}

function getGameSettings(game, overrides) {
  if (!game?.options?.length) return {}
  return Object.fromEntries(game.options.map(option => [
    option.id,
    overrides?.[option.id] ?? option.defaultValue ?? option.options[0]?.value,
  ]))
}

function getGameMode(game, preferredMode) {
  if (!game) return preferredMode
  if (game.modes.length === 1 && game.modes[0] === 'solo') return 'solo'
  if (preferredMode === 'pvp' && game.modes.includes('local-2p')) return 'pvp'
  if (preferredMode === 'pvai' && game.modes.includes('vs-ai')) return 'pvai'
  if (game.modes.includes('vs-ai')) return 'pvai'
  if (game.modes.includes('local-2p')) return 'pvp'
  return preferredMode
}
