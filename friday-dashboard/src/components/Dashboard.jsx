import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../hooks/useData.js'

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

  return (
    <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
      <div style={{
        fontFamily: 'var(--font-secondary)',
        fontSize: '52px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        color: 'var(--accent)',
        textShadow: '0 0 30px rgba(0,212,255,0.7), 0 0 60px rgba(0,212,255,0.3)',
        lineHeight: 1,
      }}>
        {time.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Melbourne' })}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', letterSpacing: '0.2em', marginTop: '6px' }}>
        {new Intl.DateTimeFormat('en-AU', { weekday: 'long', timeZone: 'Australia/Melbourne' }).format(time).toUpperCase()} · {new Intl.DateTimeFormat('en-AU', { day: 'numeric', timeZone: 'Australia/Melbourne' }).format(time)} {months[new Intl.DateTimeFormat('en-AU', { month: 'numeric', timeZone: 'Australia/Melbourne' }).format(time) - 1]} {new Intl.DateTimeFormat('en-AU', { year: 'numeric', timeZone: 'Australia/Melbourne' }).format(time)}
      </div>
    </div>
  )
}

function ProgressRing({ value, max, color, label, unit }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circ - pct * circ

  return (
    <div className="ring-container">
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" className="ring-svg">
          <circle className="ring-track" cx="40" cy="40" r={r} strokeWidth="5" />
          <circle
            className="ring-fill"
            cx="40" cy="40" r={r}
            strokeWidth="5"
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </div>
          {unit && <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{unit}</div>}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>/ {max}{unit}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: dietData } = useData('diet-log.json')
  const { data: tasksData } = useData('tasks.json')
  const { data: workoutData } = useData('workouts.json')
  const { data: calData } = useData('calendar.json')

  const today = new Date().toISOString().split('T')[0]
  const todayDiet = dietData?.logs?.find(l => l.date === today)
  const todayWorkout = workoutData?.logs?.find(w => w.date === today)
  const nextEvent = calData?.events?.filter(e => e.date >= today).sort((a,b) => a.date.localeCompare(b.date))[0]
  const openTasks = tasksData?.tasks?.filter(t => t.status !== 'done').length ?? 0

  const macros = dietData?.targets ?? { calories: 2200, protein: 180, fibre: 35 }
  const todayMacros = todayDiet?.totals ?? { calories: 0, protein: 0, fibre: 0 }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '8px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Welcome back
          </div>
          <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Adrian
          </div>
        </div>
        <div className="arc-reactor">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.9)" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <span className="status-badge status-online">
          <span className="status-dot" />
          FRIDAY ONLINE
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
          All systems nominal
        </span>
      </div>

      {/* Clock Panel */}
      <div className="panel glow-border" style={{ marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
        <div className="scan-line" />
        <Clock />
      </div>

      {/* Today's Macros */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-title">Today's Nutrition</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <ProgressRing
            value={todayMacros.calories}
            max={macros.calories}
            color="var(--accent)"
            label="Calories"
            unit="kcal"
          />
          <ProgressRing
            value={todayMacros.protein}
            max={macros.protein}
            color="#00ff88"
            label="Protein"
            unit="g"
          />
          <ProgressRing
            value={todayMacros.fibre}
            max={macros.fibre}
            color="#ffaa00"
            label="Fibre"
            unit="g"
          />
        </div>
        <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: '12px' }} onClick={() => navigate('/diet')}>
          Log a Meal →
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid-2" style={{ marginBottom: '14px' }}>
        <div className="stat-card" onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{openTasks}<span className="stat-unit"> open</span></div>
          <div className="stat-label">Active Tasks</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/gym')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{todayWorkout ? '✓' : '—'}</div>
          <div className="stat-label">{todayWorkout ? todayWorkout.name : 'No Workout Today'}</div>
        </div>
      </div>

      {/* Next Event */}
      {nextEvent && (
        <div className="panel" style={{ marginBottom: '14px' }}>
          <div className="panel-title">Next Event</div>
          <div className="cal-event" onClick={() => navigate('/calendar')} style={{ cursor: 'pointer' }}>
            <div className="cal-date-block">
              <div className="cal-day">{new Date(nextEvent.date + 'T00:00:00').getDate()}</div>
              <div className="cal-month">
                {new Date(nextEvent.date + 'T00:00:00').toLocaleString('en', { month: 'short' }).toUpperCase()}
              </div>
            </div>
            <div className="cal-content">
              <div className="cal-title">{nextEvent.title}</div>
              {nextEvent.time && <div className="cal-meta">⏱ {nextEvent.time}</div>}
              {nextEvent.location && <div className="cal-meta">📍 {nextEvent.location}</div>}
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-title">System Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Diet Tracker', status: 'NOMINAL', color: 'var(--success)' },
            { label: 'Fitness Module', status: 'NOMINAL', color: 'var(--success)' },
            { label: 'Task Manager', status: openTasks > 5 ? 'HIGH LOAD' : 'NOMINAL', color: openTasks > 5 ? 'var(--warning)' : 'var(--success)' },
            { label: 'Calendar Sync', status: 'NOMINAL', color: 'var(--success)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '11px', color: s.color, letterSpacing: '0.1em' }}>
                ● {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
