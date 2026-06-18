export default function Header({ game, onGameChange, statusText, statusClass }) {
  return (
    <header className="header">
      <div className="logo">♟ <span>Games</span></div>

      <div className="game-tabs">
        {['gomoku', 'morris', 'othello'].map(g => (
          <button
            key={g}
            className={`tab-btn${game === g ? ' active' : ''}`}
            onClick={() => onGameChange(g)}
          >
            {g === 'gomoku' ? 'Gomoku' : g === 'morris' ? 'Morris' : 'Othello'}
          </button>
        ))}
      </div>

      <div className={`status status-${statusClass}`}>{statusText}</div>
    </header>
  )
}
