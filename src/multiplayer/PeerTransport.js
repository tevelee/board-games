import Peer from 'peerjs'

// Prefix keeps our room IDs from colliding with arbitrary PeerJS peers
const PREFIX = 'bgames-'
// 32 chars: uppercase alpha excluding O/I, digits excluding 0/1
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRoomCode() {
  return Array.from({ length: 6 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export class PeerTransport {
  constructor() {
    this._peer = null
    this._conn = null
    this._msgHandlers = new Set()
    this._statusHandlers = new Set()
  }

  // Host: claim a peer ID matching the room code, then wait for incoming connections.
  createRoom(code) {
    return new Promise((resolve, reject) => {
      const peer = new Peer(PREFIX + code, { debug: 0 })
      this._peer = peer

      peer.on('open', () => resolve())
      peer.on('error', (err) => {
        if (err.type === 'unavailable-id') {
          reject(new Error('Room code already in use. Try creating a new one.'))
        } else {
          reject(err)
        }
      })

      peer.on('connection', (conn) => {
        this._setupConnection(conn)
      })
    })
  }

  // Guest: connect to the host peer identified by the room code.
  joinRoom(code) {
    return new Promise((resolve, reject) => {
      const peer = new Peer({ debug: 0 })
      this._peer = peer

      peer.on('open', () => {
        const conn = peer.connect(PREFIX + code, { reliable: true })
        conn.on('open', () => {
          this._setupConnection(conn)
          resolve()
        })
        conn.on('error', reject)
      })

      peer.on('error', (err) => {
        if (err.type === 'peer-unavailable') {
          reject(new Error('Room not found. Check the code and try again.'))
        } else {
          reject(err)
        }
      })
    })
  }

  _setupConnection(conn) {
    this._conn = conn

    conn.on('data', (data) => {
      for (const h of this._msgHandlers) h(data)
    })

    conn.on('close', () => this._emit('disconnected'))
    conn.on('error', () => this._emit('error'))

    this._emit('connected')
  }

  send(message) {
    this._conn?.send(message)
  }

  onMessage(handler) {
    this._msgHandlers.add(handler)
    return () => this._msgHandlers.delete(handler)
  }

  onStatus(handler) {
    this._statusHandlers.add(handler)
    return () => this._statusHandlers.delete(handler)
  }

  _emit(status) {
    for (const h of this._statusHandlers) h(status)
  }

  destroy() {
    this._conn?.close()
    this._peer?.destroy()
    this._peer = null
    this._conn = null
    this._msgHandlers.clear()
    this._statusHandlers.clear()
  }
}
