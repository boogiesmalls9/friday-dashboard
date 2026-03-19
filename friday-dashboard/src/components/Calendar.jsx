import { useData } from '../hooks/useData.js'

const CATEGORY_COLORS = {
  work: 'var(--accent)',
  personal: '#00ff88',
  health: '#ffaa00',
  family: '#ff88cc',
  sport: '#ff6633',
  default: 'var(--accent)',
}

function EventCard({ event }) {
  const today = new Date().toISOString().split('T')[0]
  const isToday = event.date === today
  const isPast = event.date < today

  const d = new Date(event.date + 'T00:00:00')
  const day = d.getDate()
  const month = d.toLocaleString('en', { month: 'short' }).toUpperCase()
  const weekday = d.toLocaleString('en', { weekday: 'short' }).toUpperCase()

  const color = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.default

  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      padding: '14px',
      background: isToday ? 'rgba(0,212,255,0.06)' : 'var(--bg-panel)',
      border: `1px solid ${isToday ? 'var(--accent-dim)' : 'var(--border)'}`,
      borderLeft: `3px solid ${isPast ? 'rgba(255,255,255,0.1)' : color}`,
      borderRadius: '0 10px 10px 0',
      opacity: isPast ? 0.5 : 1,
    }}>
      <div style={{ textAlign: 'center', minWidth: '44px' }}>
        <div style={{
          fontFamily: 'var(--font-secondary)',
          fontSize: '26px',
          fontWeight: 700,
          color: isPast ? 'var(--text-dim)' : color,
          lineHeight: 1,
          textShadow: isPast ? 'none' : `0 0 15px ${color}50`,
        }}>
          {day}
        </div>
        <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-dim)' }}>
          {month}
        </div>
        <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--text-dim)', marginTop: '2px' }}>
          {weekday}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: isPast ? 'var(--text-dim)' : 'var(--text-primary)', lineHeight: 1.3 }}>
            {event.title}
          </div>
          {isToday && (
            <span style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid var(--accent-dim)',
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}>TODAY</span>
          )}
        </div>
        {event.time && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {event.time}
          </div>
        )}
        {event.location && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {event.location}
          </div>
        )}
        {event.description && (
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '5px', lineHeight: 1.4 }}>
            {event.description}
          </div>
        )}
        {event.category && (
          <div style={{ marginTop: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color,
              background: `${color}18`,
              border: `1px solid ${color}40`,
              padding: '2px 7px',
              borderRadius: '4px',
            }}>
              {event.category}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Calendar() {
  const { data, loading } = useData('calendar.json')

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.1em' }}>LOADING...</div>
    </div>
  )

  const today = new Date().toISOString().split('T')[0]
  const allEvents = data?.events ?? []
  const sortedEvents = [...allEvents].sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = sortedEvents.filter(e => e.date >= today)
  const past = sortedEvents.filter(e => e.date < today).reverse().slice(0, 5)

  // Group upcoming by month
  const groupedUpcoming = upcoming.reduce((acc, ev) => {
    const d = new Date(ev.date + 'T00:00:00')
    const key = d.toLocaleString('en', { month: 'long', year: 'numeric' }).toUpperCase()
    if (!acc[key]) acc[key] = []
    acc[key].push(ev)
    return acc
  }, {})

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Intel Calendar</div>
        <div className="page-subtitle">Upcoming Operations</div>
      </div>

      {/* Quick stats */}
      <div className="grid-2" style={{ marginBottom: '14px' }}>
        <div className="stat-card">
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {upcoming.filter(e => {
              const d = new Date(e.date + 'T00:00:00')
              const now = new Date()
              const diff = (d - now) / (1000 * 60 * 60 * 24)
              return diff <= 7
            }).length}
          </div>
          <div className="stat-label">This Week</div>
        </div>
      </div>

      {/* Upcoming events grouped by month */}
      {Object.keys(groupedUpcoming).length === 0 ? (
        <div className="empty-state" style={{ marginBottom: '14px' }}>
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No upcoming events</div>
        </div>
      ) : (
        Object.entries(groupedUpcoming).map(([month, events]) => (
          <div key={month} style={{ marginBottom: '18px' }}>
            <div style={{
              fontFamily: 'var(--font-secondary)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              marginBottom: '10px',
              paddingLeft: '4px',
            }}>
              {month}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {events.map((ev, i) => <EventCard key={i} event={ev} />)}
            </div>
          </div>
        ))
      )}

      {/* Past events */}
      {past.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            marginBottom: '10px',
            paddingLeft: '4px',
          }}>
            Recent Past
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {past.map((ev, i) => <EventCard key={i} event={ev} />)}
          </div>
        </div>
      )}

      {/* How to add */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-title">How to Add Events</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Tell FRIDAY: <em style={{ color: 'var(--text-primary)' }}>"Add an event: [title] on [date] at [time] at [location]"</em>
          <br />or edit <code style={{ color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', padding: '1px 5px', borderRadius: '3px' }}>/public/data/calendar.json</code> directly.
          <br /><br />
          <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', fontSize: '11px', letterSpacing: '0.08em' }}>CATEGORIES:</strong>{' '}
          <span style={{ color: 'var(--text-dim)' }}>work · personal · health · family · sport</span>
        </div>
      </div>

      <div style={{ height: '8px' }} />
    </div>
  )
}
