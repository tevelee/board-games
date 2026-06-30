# Adding a Game

Use this directory for new games.

Recommended shape:

```text
src/games/<game-id>/
  Game.jsx
  logic.js
  ai.js
  meta.js
```

Minimum steps:

1. Add catalog metadata (title, status, modes, tags, ...) in `src/gameRegistry.js`.
2. Build a `forwardRef` game component with props `mode`, `difficulty`,
   optional `settings`, and `onStateChange`. `mode` can be `solo`, `pvai`,
   or `pvp`.
3. Keep a local history stack and expose `reset()` and `undo()` through the ref.
4. Add a `meta.js` exporting `hint`, `rules`, and optionally `options` and
   `scoreLabels` for the game (see any existing game folder for the shape).
5. Add one entry to the `registrations` list in `src/playableGames.jsx`
   pairing the catalog id with the `Game.jsx` component and `meta.js`.
6. Run `npm run build`.

Use `src/games/shared/runtime.js` for shell state constants and normalization. See
`docs/game-architecture.md` for the full contract and design requirements.
