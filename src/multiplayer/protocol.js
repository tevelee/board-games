export const MSG = {
  HELLO:   'hello',   // guest → host on connect
  WELCOME: 'welcome', // host → guest: { localPlayer }
  MOVE:    'move',    // both:  { data: any }
  RESET:   'reset',   // both:  {}
  UNDO:    'undo',    // both:  {}
  RESIGN:  'resign',  // both:  {}
  PING:    'ping',    // both:  { ts }
  PONG:    'pong',    // both:  { ts }
}
