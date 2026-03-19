import { useState } from 'react'
import { useData } from '../hooks/useData.js'

function ProgressRing({ value, max, color, size = 70, strokeWidth = 5 }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circ - pct * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 4px ${color})` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  )
}

function MacroRing({ label, value, max, color }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: 70, height: 70 }}>
        <ProgressRing value={value} max={max} color={color} size={70} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {pct}%
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '16px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>/ {max}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>{label}</div>
      </div>
    </div>
  )
}

export default function Diet() {
  const { data, loading } = useData('diet-log.json')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', calories: '', protein: '', fibre: '' })

  const today = new Date().toISOString().split('T')[0]
  const todayLog = data?.logs?.find(l => l.date === today)
  const targets = data?.targets ?? { calories: 2200, protein: 180, fibre: 35 }
  const totals = todayLog?.totals ?? { calories: 0, protein: 0, fibre: 0 }
  const meals = todayLog?.meals ?? []

  // Past 7 days for log
  const recentLogs = data?.logs?.slice().reverse().slice(0, 7) ?? []

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.1em' }}>LOADING...</div>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Diet Tracker</div>
        <div className="page-subtitle">Nutritional Command Centre</div>
      </div>

      {/* Date */}
      <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em', marginBottom: '14px', textTransform: 'uppercase' }}>
        {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>

      {/* Macro Rings */}
      <div className="panel glow-border" style={{ marginBottom: '14px' }}>
        <div className="panel-title">Today's Macros</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '4px' }}>
          <MacroRing label="Calories" value={totals.calories} max={targets.calories} color="var(--accent)" />
          <MacroRing label="Protein" value={totals.protein} max={targets.protein} color="#00ff88" />
          <MacroRing label="Fibre" value={totals.fibre} max={targets.fibre} color="#ffaa00" />
        </div>

        {/* Progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          {[
            { label: 'Calories', value: totals.calories, max: targets.calories, color: 'var(--accent)', unit: 'kcal' },
            { label: 'Protein', value: totals.protein, max: targets.protein, color: '#00ff88', unit: 'g' },
            { label: 'Fibre', value: totals.fibre, max: targets.fibre, color: '#ffaa00', unit: 'g' },
          ].map(m => (
            <div key={m.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-secondary)', color: m.color }}>
                  {m.value} / {m.max}{m.unit}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                  background: m.color,
                  color: m.color,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meals */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-title">Today's Meals</div>
        {meals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <div className="empty-state-text">No meals logged yet</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {meals.map((meal, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < meals.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{meal.name}</div>
                  {meal.time && <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{meal.time}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '13px', color: 'var(--accent)' }}>{meal.calories} kcal</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {meal.protein}g P · {meal.fibre}g F
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-primary btn-full" style={{ marginTop: '12px' }} onClick={() => setShowAdd(true)}>
          + Log Meal
        </button>
      </div>

      {/* Recent History */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-title">7-Day History</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {recentLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-text">No history yet</div>
            </div>
          ) : recentLogs.map((log, i) => {
            const calPct = Math.min(Math.round((log.totals.calories / targets.calories) * 100), 100)
            const isToday = log.date === today
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                borderBottom: i < recentLogs.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none',
              }}>
                <div style={{ minWidth: '60px' }}>
                  <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px', color: isToday ? 'var(--accent)' : 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {isToday ? 'Today' : new Date(log.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${calPct}%`, background: 'var(--accent)', color: 'var(--accent)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '12px', color: 'var(--text-primary)', minWidth: '70px', textAlign: 'right' }}>
                  {log.totals.calories} kcal
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Log a Meal</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
              Edit <code style={{ color: 'var(--accent)', background: 'rgba(0,212,255,0.1)', padding: '1px 6px', borderRadius: '4px' }}>/public/data/diet-log.json</code> directly to add meals, or use the form below as a guide.
            </p>
            <div className="input-group">
              <label className="input-label">Meal Name</label>
              <input className="input" placeholder="e.g. Chicken & Rice" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="grid-3" style={{ gap: '10px', marginBottom: '16px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Cals</label>
                <input className="input" type="number" placeholder="500" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Protein</label>
                <input className="input" type="number" placeholder="40g" value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Fibre</label>
                <input className="input" type="number" placeholder="5g" value={form.fibre} onChange={e => setForm({...form, fibre: e.target.value})} />
              </div>
            </div>
            <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.08em' }}>HOW TO ADD DATA</strong><br />
              Ask FRIDAY to add this meal by saying: "Add [meal name] with [X] calories, [X]g protein, [X]g fibre to today's diet log."
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setShowAdd(false)}>
              Got it — Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
