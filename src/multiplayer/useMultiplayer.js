import { useState, useRef, useCallback, useEffect } from 'react'
import { PeerTransport, generateRoomCode } from './PeerTransport.js'
import { MSG } from './protocol.js'

// session.status values:
//   null        — not in online mode
//   'creating'  — registering peer with signaling server
//   'waiting'   — room open, waiting for opponent to join
//   'joining'   — connecting to host peer
//   'connected' — both players present, game is live
//   'disconnected' — opponent closed/lost connection

export function useMultiplayer({ onRemoteMove, onRemoteReset } = {}) {
  const [session, setSession] = useState(null)
  const [error, setError]     = useState(null)

  const transportRef  = useRef(null)
  const callbacksRef  = useRef({ onRemoteMove, onRemoteReset })

  useEffect(() => {
    callbacksRef.current = { onRemoteMove, onRemoteReset }
  })

  function handleMessage(msg) {
    const { onRemoteMove, onRemoteReset } = callbacksRef.current
    if (msg.type === MSG.MOVE)  onRemoteMove?.(msg.data)
    if (msg.type === MSG.RESET) onRemoteReset?.()
    if (msg.type === MSG.PING)  transportRef.current?.send({ type: MSG.PONG, ts: msg.ts })
  }

  const createRoom = useCallback(async () => {
    setError(null)
    const code      = generateRoomCode()
    const transport = new PeerTransport()
    transportRef.current = transport

    setSession({ status: 'creating', roomCode: code, localPlayer: 1 })

    try {
      await transport.createRoom(code)
    } catch (err) {
      transport.destroy()
      transportRef.current = null
      setSession(null)
      setError(err.message ?? 'Could not create room.')
      return
    }

    setSession({ status: 'waiting', roomCode: code, localPlayer: 1 })

    transport.onMessage(handleMessage)
    transport.onStatus((status) => {
      if (status === 'connected') {
        // Tell the guest which player number they are
        transport.send({ type: MSG.WELCOME, localPlayer: 2 })
        setSession(s => s ? { ...s, status: 'connected' } : null)
      } else if (status === 'disconnected') {
        setSession(s => s ? { ...s, status: 'disconnected' } : null)
      }
    })
  }, [])

  const joinRoom = useCallback(async (rawCode) => {
    setError(null)
    const code      = rawCode.trim().toUpperCase()
    const transport = new PeerTransport()
    transportRef.current = transport

    setSession({ status: 'joining', roomCode: code, localPlayer: 2 })

    try {
      await transport.joinRoom(code)
    } catch (err) {
      transport.destroy()
      transportRef.current = null
      setSession(null)
      setError(err.message ?? 'Could not join room.')
      return
    }

    // localPlayer will be confirmed by WELCOME message from host
    transport.onMessage((msg) => {
      if (msg.type === MSG.WELCOME) {
        setSession(s => s ? { ...s, status: 'connected', localPlayer: msg.localPlayer } : null)
      }
      handleMessage(msg)
    })

    transport.onStatus((status) => {
      if (status === 'disconnected') {
        setSession(s => s ? { ...s, status: 'disconnected' } : null)
      }
    })

    transport.send({ type: MSG.HELLO })
  }, [])

  const sendMove = useCallback((data) => {
    transportRef.current?.send({ type: MSG.MOVE, data })
  }, [])

  const sendReset = useCallback(() => {
    transportRef.current?.send({ type: MSG.RESET })
  }, [])

  const leave = useCallback(() => {
    transportRef.current?.destroy()
    transportRef.current = null
    setSession(null)
    setError(null)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      transportRef.current?.destroy()
    }
  }, [])

  return { session, error, createRoom, joinRoom, sendMove, sendReset, leave }
}
