import { useState, useRef, useEffect } from 'react'
import './MultiplayerLobby.css'

export default function MultiplayerLobby({
  session,
  error,
  gameTitle,
  onCreateRoom,
  onJoinRoom,
  onLeave,
}) {
  const { status } = session ?? {}

  if (status === 'creating' || status === 'joining') {
    return (
      <div className="mp-lobby">
        <div className="mp-card">
          <div className="mp-kicker">Online Play</div>
          <h2 className="mp-title">Connecting...</h2>
          <div className="mp-spinner" />
        </div>
      </div>
    )
  }

  if (status === 'waiting') {
    return <WaitingScreen roomCode={session.roomCode} onLeave={onLeave} />
  }

  if (status === 'disconnected') {
    return (
      <div className="mp-lobby">
        <div className="mp-card">
          <div className="mp-kicker">Online Play</div>
          <h2 className="mp-title">Opponent left</h2>
          <p className="mp-desc">Your opponent disconnected from the game.</p>
          <button className="mp-btn-primary" type="button" onClick={onCreateRoom}>New Room</button>
          <button className="mp-btn-ghost" type="button" onClick={onLeave}>Back to local play</button>
        </div>
      </div>
    )
  }

  // Idle (no session) — show entry point
  return <EntryScreen gameTitle={gameTitle} error={error} onCreateRoom={onCreateRoom} onJoinRoom={onJoinRoom} onLeave={onLeave} />
}

function WaitingScreen({ roomCode, onLeave }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const url = `${window.location.href.replace(/#.*$/, '')}#${window.location.hash.replace(/^#/, '')}`
    const text = `Join me! Room code: ${roomCode}\n${url}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mp-lobby">
      <div className="mp-card">
        <div className="mp-kicker">Online Play</div>
        <h2 className="mp-title">Room ready</h2>
        <p className="mp-desc">Share this code with your opponent</p>
        <div className="mp-room-code" aria-label={`Room code: ${roomCode}`}>{roomCode}</div>
        <div className="mp-share">
          <button className="mp-btn-secondary" type="button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>
        <div className="mp-waiting">
          <span className="mp-pulse" aria-hidden="true" />
          Waiting for opponent...
        </div>
        <button className="mp-btn-ghost" type="button" onClick={onLeave}>Cancel</button>
      </div>
    </div>
  )
}

function EntryScreen({ gameTitle, error, onCreateRoom, onJoinRoom, onLeave }) {
  const [joining, setJoining] = useState(false)
  const [code, setCode]       = useState('')
  const inputRef              = useRef(null)

  useEffect(() => {
    if (joining) inputRef.current?.focus()
  }, [joining])

  if (joining) {
    return (
      <div className="mp-lobby">
        <div className="mp-card">
          <div className="mp-kicker">Online Play</div>
          <h2 className="mp-title">Join a room</h2>
          <p className="mp-desc">Enter the 6-character code from your opponent</p>
          {error && <div className="mp-error" role="alert">{error}</div>}
          <input
            ref={inputRef}
            className="mp-code-input"
            type="text"
            inputMode="text"
            placeholder="ABC123"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            onKeyDown={e => e.key === 'Enter' && code.length === 6 && onJoinRoom(code)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Room code"
          />
          <button
            className="mp-btn-primary"
            type="button"
            disabled={code.length !== 6}
            onClick={() => onJoinRoom(code)}
          >
            Join game
          </button>
          <button className="mp-btn-ghost" type="button" onClick={() => { setJoining(false); setCode('') }}>Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mp-lobby">
      <div className="mp-card">
        <div className="mp-kicker">Online Play</div>
        <h2 className="mp-title">{gameTitle}</h2>
        <p className="mp-desc">Play against a friend on another device in real time — no account needed</p>
        {error && <div className="mp-error" role="alert">{error}</div>}
        <button className="mp-btn-primary" type="button" onClick={onCreateRoom}>Create room</button>
        <button className="mp-btn-secondary" type="button" onClick={() => setJoining(true)}>Join room</button>
        <button className="mp-btn-ghost" type="button" onClick={onLeave}>Back to local play</button>
      </div>
    </div>
  )
}
