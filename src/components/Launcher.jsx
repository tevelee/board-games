import { useMemo, useState } from 'react'
import {
  filterOptions,
  gameMatchesFilter,
  games,
  modeLabels,
  statusLabels,
  statusOrder,
} from '../gameRegistry.js'
import GameThumbnail from './GameThumbnail.jsx'

export default function Launcher({ onLaunch }) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const playableCount = useMemo(() => games.filter(game => game.status === 'playable').length, [])
  const roadmapCount = useMemo(() => games.filter(game => game.status !== 'playable').length, [])
  const categoryCount = useMemo(() => new Set(games.map(game => game.category)).size, [])

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase()
    return games
      .filter(game => {
        if (q) {
          const haystack = [game.title, game.category, game.complexity, game.duration, ...(game.aliases ?? []), ...game.tags, ...game.modes].join(' ').toLowerCase()
          if (!haystack.includes(q)) return false
        }
        return activeFilters.every(filter => gameMatchesFilter(game, filter))
      })
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.title.localeCompare(b.title))
  }, [activeFilters, query])

  const hasActiveCatalogFilters = query.trim().length > 0 || activeFilters.length > 0

  const spotlightGame = useMemo(() => {
    const defaultSpotlight = games.find(game => game.id === 'hive') ?? games[0]
    if (!hasActiveCatalogFilters) return defaultSpotlight

    return filteredGames.find(game => game.status === 'playable')
      ?? filteredGames[0]
      ?? defaultSpotlight
  }, [filteredGames, hasActiveCatalogFilters])

  function toggleFilter(filter) {
    setActiveFilters(filters =>
      filters.includes(filter)
        ? filters.filter(item => item !== filter)
        : [...filters, filter]
    )
  }

  function clearCatalogFilters() {
    setQuery('')
    setActiveFilters([])
  }

  function launchGame(game) {
    if (game.status === 'playable') onLaunch(game.id)
  }

  return (
    <main className="launcher">
      <section className="launcher-hero" aria-labelledby="launcher-title">
        <div className="launcher-hero-copy">
          <span className="launcher-kicker">Classic tables, puzzles, and duels</span>
          <h1 id="launcher-title">Game Library</h1>
          <p className="launcher-intro">
            A polished shelf of playable classics, solo puzzles, and upcoming tabletop ideas.
          </p>
          <div className="launcher-counts">
            <span><strong>{playableCount}</strong> playable</span>
            <span><strong>{roadmapCount}</strong> on roadmap</span>
            <span><strong>{categoryCount}</strong> categories</span>
          </div>
        </div>

        <button
          className={`spotlight-card status-${spotlightGame.status}`}
          type="button"
          disabled={spotlightGame.status !== 'playable'}
          aria-disabled={spotlightGame.status !== 'playable'}
          onClick={() => launchGame(spotlightGame)}
        >
          <span className="spotlight-label">
            {spotlightGame.status === 'playable' ? 'Featured playable' : 'Catalog preview'}
          </span>
          <GameThumbnail type={spotlightGame.visual} className="spotlight-graphic" />
          <span className="spotlight-body">
            <span className="spotlight-title-row">
              <span className="spotlight-title">{spotlightGame.title}</span>
              <span className={`tile-status ${spotlightGame.status}`}>{statusLabels[spotlightGame.status]}</span>
            </span>
            <span className="spotlight-category">{spotlightGame.category}</span>
            <span className="spotlight-meta">
              <span>{spotlightGame.complexity}</span>
              <span>{spotlightGame.duration}</span>
              <span>{spotlightGame.modes.map(mode => modeLabels[mode] ?? mode).join(' / ')}</span>
            </span>
          </span>
        </button>
      </section>

      <section className="catalog-controls" aria-label="Catalog controls">
        <label className="game-search">
          <span>Search</span>
          <span className="search-field">
            <span className="search-glyph" aria-hidden="true" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search title, mode, or tag"
              type="search"
            />
          </span>
        </label>

        <div className="filter-row" aria-label="Game filters">
          {filterOptions.map(filter => (
            <button
              key={filter.id}
              className={`filter-chip${activeFilters.includes(filter.id) ? ' active' : ''}`}
              type="button"
              aria-pressed={activeFilters.includes(filter.id)}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="catalog-results" aria-live="polite">
          <span>{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} shown</span>
          {hasActiveCatalogFilters && (
            <button className="clear-filters" type="button" onClick={clearCatalogFilters}>
              Reset
            </button>
          )}
        </div>
      </section>

      {filteredGames.length === 0 ? (
        <div className="empty-library">No games match those filters.</div>
      ) : (
        <div className="game-grid">
          {filteredGames.map(game => {
            const playable = game.status === 'playable'
            return (
              <button
                key={game.id}
                className={`game-tile status-${game.status}`}
                type="button"
                disabled={!playable}
                aria-disabled={!playable}
                aria-label={`${game.title}, ${statusLabels[game.status]}`}
                onClick={() => launchGame(game)}
              >
                <span className="tile-accent" aria-hidden="true" />
                <span className="tile-graphic-wrap">
                  <GameThumbnail type={game.visual} />
                </span>
                <span className="tile-body">
                  <span className="tile-title-row">
                    <span className="tile-title">{game.title}</span>
                    <span className={`tile-status ${game.status}`}>{statusLabels[game.status]}</span>
                  </span>
                  <span className="tile-category">{game.category}</span>
                  <span className="tile-meta">
                    <span>{game.complexity}</span>
                    <span>{game.duration}</span>
                  </span>
                  <span className="mode-row">
                    {game.modes.map(mode => <span key={mode}>{modeLabels[mode] ?? mode}</span>)}
                  </span>
                  <span className="tile-footer">
                    <span>{playable ? 'Launch game' : game.status === 'planned' ? 'On roadmap' : 'Concept'}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}
