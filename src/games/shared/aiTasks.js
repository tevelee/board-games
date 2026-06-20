import { loadAiFunction } from './aiModules.js'

let nextTaskId = 1

export function runAiTask(game, exportName, args) {
  if (typeof Worker === 'undefined') {
    let cancelled = false
    const promise = loadAiFunction(game, exportName)
      .then(fn => (cancelled ? undefined : fn(...args)))

    return {
      promise,
      cancel() {
        cancelled = true
      },
    }
  }

  const id = nextTaskId++
  const worker = new Worker(new URL('./aiWorker.js', import.meta.url), { type: 'module' })

  const promise = new Promise((resolve, reject) => {
    worker.addEventListener('message', event => {
      if (event.data?.id !== id) return
      worker.terminate()

      if (event.data.error) {
        const error = new Error(event.data.error.message)
        error.stack = event.data.error.stack
        reject(error)
      } else {
        resolve(event.data.result)
      }
    })

    worker.addEventListener('error', event => {
      worker.terminate()
      reject(event.error ?? new Error(event.message))
    })
  })

  worker.postMessage({ id, game, exportName, args })

  return {
    promise,
    cancel() {
      worker.terminate()
    },
  }
}
