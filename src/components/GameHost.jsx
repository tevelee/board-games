import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { createGameUiState, normalizeGameUiState } from '../games/shared/runtime.js'
import { playableGames } from '../playableGames.jsx'

function createInitialUiByGame() {
  return Object.fromEntries(playableGames.map(game => [game.id, createGameUiState()]))
}

const GameHost = forwardRef(function GameHost({
  activeGameId,
  mode,
  difficulty,
  settings,
  aiFirst,
  onActiveStateChange,
}, ref) {
  const gameRefs = useRef({})
  const [uiByGame, setUiByGame] = useState(createInitialUiByGame)
  // Games mount on first visit and then stay mounted, so switching back to a
  // previously played game resumes its in-progress state. Games never
  // visited this session are not mounted at all, keeping initial load light.
  // Previous id is tracked in state (not a ref) so this stays safe under
  // StrictMode's double-render purity check.
  const [mountedIds, setMountedIds] = useState(() => new Set(activeGameId ? [activeGameId] : []))
  const [prevActiveGameId, setPrevActiveGameId] = useState(activeGameId)

  if (activeGameId !== prevActiveGameId) {
    setPrevActiveGameId(activeGameId)
    if (activeGameId && !mountedIds.has(activeGameId)) {
      setMountedIds(new Set(mountedIds).add(activeGameId))
    }
  }

  const activeUiState = useMemo(
    () => activeGameId ? (uiByGame[activeGameId] ?? createGameUiState()) : createGameUiState(),
    [activeGameId, uiByGame]
  )

  const setGameRef = useCallback((gameId, instance) => {
    if (instance) gameRefs.current[gameId] = instance
    else delete gameRefs.current[gameId]
  }, [])

  const handleGameStateChange = useCallback((gameId, nextState) => {
    setUiByGame(prev => ({
      ...prev,
      [gameId]: normalizeGameUiState(nextState, prev[gameId]),
    }))
  }, [])

  useEffect(() => {
    onActiveStateChange?.(activeUiState)
  }, [activeUiState, onActiveStateChange])

  useImperativeHandle(ref, () => ({
    resetActive() {
      if (!activeGameId) return
      gameRefs.current[activeGameId]?.reset?.()
    },
    undoActive() {
      if (!activeGameId) return
      gameRefs.current[activeGameId]?.undo?.()
    },
  }), [activeGameId])

  return (
    <div className="canvas-wrap" style={{
      visibility:    activeGameId ? 'visible' : 'hidden',
      pointerEvents: activeGameId ? 'auto'    : 'none',
    }}>
      {playableGames.filter(game => mountedIds.has(game.id)).map(({ id, Component }) => (
        <div
          key={id}
          className="game-layer"
          style={{
            visibility:    activeGameId === id ? 'visible' : 'hidden',
            pointerEvents: activeGameId === id ? 'auto'    : 'none',
          }}
        >
          <Component
            ref={instance => setGameRef(id, instance)}
            active={activeGameId === id}
            mode={mode}
            difficulty={difficulty}
            settings={activeGameId === id ? settings : undefined}
            aiFirst={activeGameId === id ? aiFirst : false}
            onStateChange={state => handleGameStateChange(id, state)}
          />
        </div>
      ))}
    </div>
  )
})

export default GameHost
