import { loadAiFunction } from './aiModules.js'

self.addEventListener('message', async event => {
  const { id, game, exportName, args } = event.data ?? {}

  try {
    const fn = await loadAiFunction(game, exportName)
    self.postMessage({ id, result: fn(...args) })
  } catch (error) {
    self.postMessage({
      id,
      error: {
        message: error?.message ?? String(error),
        stack: error?.stack ?? '',
      },
    })
  }
})
