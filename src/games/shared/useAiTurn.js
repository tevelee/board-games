import { useEffect } from 'react'

// Maps a difficulty to a "thinking" delay in ms, falling back to medium.
export function aiDelay(difficulty, delays) {
  return delays[difficulty] ?? delays.medium
}

// Shared scheduling for an AI turn. Games declare when a turn is `active`, how
// long to think (`delay`), how to `startTask` (returns a runAiTask handle), and
// how to fold the result/error back into state. The hook owns the boilerplate:
// the timer, task cancellation, post-cleanup guarding, and error logging.
//
// `onResult(state, result)` and `onError(state)` are passed straight to the
// state setter, so they keep ownership of their own busy/winner guards.
export function useAiTurn({ active, delay, startTask, onResult, onError, setState, deps }) {
  useEffect(() => {
    if (!active) return undefined

    let task = null
    let cancelled = false

    const timer = setTimeout(() => {
      task = startTask()
      task.promise
        .then(result => {
          if (!cancelled) setState(state => onResult(state, result))
        })
        .catch(error => {
          if (cancelled) return
          console.error(error)
          setState(state => {
            if (!state.busy) return state
            return onError ? onError(state) : { ...state, busy: false }
          })
        })
    }, typeof delay === 'function' ? delay() : delay)

    return () => {
      cancelled = true
      clearTimeout(timer)
      task?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
