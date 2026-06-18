import { useEffect, useRef, useState } from 'react'

function SelectMenu({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const selected = options.find(option => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="select-wrap" ref={rootRef}>
      <button
        className={`select-trigger${open ? ' open' : ''}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen(value => !value)}
      >
        <span>{selected.label}</span>
        <span className="select-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="select-menu" role="listbox" aria-label={label}>
          {options.map(option => (
            <button
              key={option.value}
              className={`select-option${option.value === value ? ' selected' : ''}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionMenu({ canUndo, onUndo }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="action-wrap" ref={rootRef}>
      <button
        className={`btn-more${open ? ' open' : ''}`}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More actions"
        onClick={() => setOpen(value => !value)}
      >
        <span aria-hidden="true">...</span>
      </button>

      {open && (
        <div className="action-menu" role="menu" aria-label="More actions">
          <button
            className="action-option"
            type="button"
            role="menuitem"
            disabled={!canUndo}
            onClick={() => {
              onUndo()
              setOpen(false)
            }}
          >
            Undo move
          </button>
        </div>
      )}
    </div>
  )
}

const MODE_OPTIONS = [
  { value: 'pvai', label: 'vs AI' },
  { value: 'pvp', label: 'vs Player' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'expert', label: 'Expert' },
]

export default function BottomBar({
  mode, difficulty, scores, hint,
  gameOptions = [], gameSettings = {}, onGameSettingChange,
  onModeChange, onDifficultyChange, onNewGame,
  canUndo, onUndo,
}) {
  const pvp = mode === 'pvp'

  return (
    <div className="bottom-bar">
      <div className="scores">
        <div className="score-chip">
          <span className="dot dot-p1" />
          <span className="score-label">{pvp ? 'P1' : 'You'}</span>
          <span className="score-val">{scores.p1}</span>
        </div>
        <span className="score-sep">:</span>
        <div className="score-chip">
          <span className="dot dot-p2" />
          <span className="score-label">{pvp ? 'P2' : 'AI'}</span>
          <span className="score-val">{scores.p2}</span>
        </div>
      </div>

      <div className="bar-hint" title={hint || undefined} aria-hidden={!hint}>
        {hint}
      </div>

      <div className="bar-controls">
        {gameOptions.map(option => (
          <SelectMenu
            key={option.id}
            label={option.label}
            value={gameSettings[option.id] ?? option.defaultValue ?? option.options[0]?.value}
            options={option.options}
            onChange={value => onGameSettingChange?.(option.id, value)}
          />
        ))}

        <SelectMenu
          label="Game mode"
          value={mode}
          options={MODE_OPTIONS}
          onChange={onModeChange}
        />

        {!pvp && (
          <SelectMenu
            label="Difficulty"
            value={difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={onDifficultyChange}
          />
        )}

        <ActionMenu canUndo={canUndo} onUndo={onUndo} />
        <button className="btn-new" onClick={onNewGame}>New Game</button>
      </div>
    </div>
  )
}
