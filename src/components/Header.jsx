export default function Header({ game, onGameChange, statusText, statusClass }) {
  return (
    <header className="header">
      <div className="logo">♟ <span>Games</span></div>

      <div className="game-tabs">
        <button
          className={`tab-btn${game === 'gomoku' ? ' active' : ''}`}
          onClick={() => onGameChange('gomoku')}
        >
          Gomoku
        </button>
        <button
          className={`tab-btn${game === 'morris' ? ' active' : ''}`}
          onClick={() => onGameChange('morris')}
        >
          Morris
        </button>
      </div>

      <div className={`status status-${statusClass}`}>{statusText}</div>
    </header>
  )
}
