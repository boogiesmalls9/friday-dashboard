import { useState } from 'react'
import { useData } from '../hooks/useData.js'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d1525',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontFamily: 'var(--font-secondary)',
        fontSize: '12px',
        color: 'var(--text-primary)',
      }}>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>{label}</div>
        <div style={{ color: 'var(--accent)' }}>{payload[0].value} kg</div>
      </div>
    )
  }
  return null
}

export default function Gym() {
  const { data, loading } = useData('workouts.json')
  const [activeTab, setActiveTab] = useState('log')

  const today = new Date().toISOString().split('T')[0]
  const todayWorkout = data?.logs?.find(w => w.date === today)
  const recentWorkouts = data?.logs?.slice().reverse().slice(0, 10) ?? []
  const weightHistory = data?.weightHistory?.slice(-14) ?? []
  const prs = data?.personalRecords ?? []

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.1em' }}>LOADING...</div>
    </div>
  )

  const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Gym & Fitness</div>
        <div className="page-subtitle">Performance Analytics</div>
      </div>

      {/* Current Weight */}
      {currentWeight && (
        <div className="panel glow-border" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                Current Weight
              </div>
              <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '42px', fontWeight: 700, color: 'var(--accent)', textShadow: '0 0 20px rgba(0,212,255,0.5)', lineHeight: 1 }}>
                {currentWeight}<span style={{ fontSize: '18px', color: 'var(--text-secondary)', marginLeft: '4px' }}>kg</span>
              </div>
            </div>
            {weightHistory.length >= 2 && (
              <div style={{ textAlign: 'right' }}>
                {(() => {
                  const prev = weightHistory[weightHistory.length - 2].weight
                  const diff = (currentWeight - prev).toFixed(1)
                  const up = diff >= 0
                  return (
                    <div>
                      <div style={{ fontSize: '20px', fontFamily: 'var(--font-secondary)', fontWeight: 700, color: up ? 'var(--danger)' : 'var(--success)' }}>
                        {up ? '+' : ''}{diff} kg
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>vs last</div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weight Chart */}
      {weightHistory.length > 0 && (
        <div className="panel" style={{ marginBottom: '14px' }}>
          <div className="panel-title">Weight Trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={weightHistory} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-dim)', fontSize: 10 }}
                tickFormatter={d => {
                  const date = new Date(d + 'T00:00:00')
                  return `${date.getDate()}/${date.getMonth()+1}`
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-dim)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 3, strokeWidth: 0 }}
                activeDot={{ fill: 'var(--accent)', r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {['log', 'prs'].map(tab => (
          <button
            key={tab}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'log' ? 'Workout Log' : 'Personal Records'}
          </button>
        ))}
      </div>

      {activeTab === 'log' && (
        <div className="stack">
          {todayWorkout && (
            <div className="panel glow-border">
              <div className="panel-title">Today · {todayWorkout.name}</div>
              {todayWorkout.exercises?.map((ex, i) => (
                <div key={i} className="exercise-row">
                  <div className="exercise-name">{ex.name}</div>
                  <div className="exercise-sets">
                    {ex.sets?.map((s, si) => (
                      <span key={si} style={{ marginLeft: si > 0 ? '6px' : 0 }}>
                        {s.reps}×{s.weight}kg
                      </span>
                    ))}
                    {ex.distance && <span>{ex.distance} km</span>}
                    {ex.duration && <span>{ex.duration}</span>}
                  </div>
                  {ex.isPR && <span className="pr-badge">PR</span>}
                </div>
              ))}
              {todayWorkout.notes && (
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0,212,255,0.04)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  {todayWorkout.notes}
                </div>
              )}
            </div>
          )}
          {recentWorkouts.filter(w => w.date !== today).slice(0, 5).map((w, i) => (
            <div key={i} className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {new Date(w.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                </div>
                {w.duration && <span className="tag">{w.duration}</span>}
              </div>
              {w.exercises?.slice(0, 3).map((ex, ei) => (
                <div key={ei} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', color: 'var(--text-secondary)', borderBottom: ei < Math.min(w.exercises.length, 3) - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none' }}>
                  <span>{ex.name}</span>
                  <span style={{ color: 'var(--text-dim)' }}>
                    {ex.sets?.map((s, si) => `${s.reps}×${s.weight}kg`).join(' · ')}
                    {ex.distance && `${ex.distance}km`}
                  </span>
                </div>
              ))}
              {w.exercises?.length > 3 && (
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>+{w.exercises.length - 3} more exercises</div>
              )}
            </div>
          ))}
          {recentWorkouts.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏋️</div>
              <div className="empty-state-text">No workouts logged yet</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prs' && (
        <div className="panel">
          <div className="panel-title">Personal Records</div>
          {prs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <div className="empty-state-text">No PRs recorded yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {prs.map((pr, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < prs.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{pr.exercise}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {new Date(pr.date + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '20px', fontWeight: 700, color: 'var(--warning)', textShadow: '0 0 10px rgba(255,170,0,0.4)' }}>
                      {pr.value}<span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '2px' }}>{pr.unit}</span>
                    </div>
                    {pr.reps && <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{pr.reps} reps</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ height: '16px' }} />
    </div>
  )
}
