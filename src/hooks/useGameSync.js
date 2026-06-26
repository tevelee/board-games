import { useRef, useEffect, useImperativeHandle } from 'react'
import { normalizeGameUiState } from '../games/shared/runtime.js'

export function useGameSync({
  ref, mode, difficulty, aiFirst = false, onStateChange,
  gs, setGs, historyRef, makeInitial,
  onExtraReset,
  preserveScores = true,
  // Optional: provide this for remote-pvp support.
  // Receives (moveData) and should call setGs with the applied move.
  onRemoteMove,
}) {
  const modeRef        = useRef(mode)
  const diffRef        = useRef(difficulty)
  const aiFirstRef     = useRef(aiFirst)
  const notifyCb       = useRef(onStateChange)
  const onRemoteMoveRef = useRef(onRemoteMove)

  useEffect(() => { modeRef.current = mode },            [mode])
  useEffect(() => { diffRef.current = difficulty },      [difficulty])
  useEffect(() => { aiFirstRef.current = aiFirst },      [aiFirst])
  useEffect(() => { notifyCb.current = onStateChange },  [onStateChange])
  useEffect(() => { onRemoteMoveRef.current = onRemoteMove }, [onRemoteMove])

  useEffect(() => {
    notifyCb.current(normalizeGameUiState({
      current:    gs.current,
      winner:     gs.winner,
      busy:       gs.busy,
      scores:     { ...gs.scores },
      passed:     gs.passed ?? false,
      historyLen: historyRef.current.length,
    }))
  }, [gs]) // historyRef and notifyCb are refs — stable, intentionally omitted

  useImperativeHandle(ref, () => ({
    reset() {
      historyRef.current = []
      setGs(s => {
        const next = makeInitial()
        const initial = (aiFirstRef.current && modeRef.current === 'pvai')
          ? { ...next, current: 2, busy: true }
          : next
        return preserveScores ? { ...initial, scores: s.scores } : initial
      })
      onExtraReset?.()
    },
    undo() {
      const prev = historyRef.current.pop()
      if (prev) setGs(prev)
    },
    // Called by GameHost when a move arrives from the remote peer.
    // Games opt in by providing onRemoteMove to useGameSync.
    applyRemoteMove(data) {
      onRemoteMoveRef.current?.(data)
    },
  }))

  return { modeRef, diffRef }
}
