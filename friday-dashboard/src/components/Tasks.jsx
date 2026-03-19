import { useState } from 'react'
import { useData } from '../hooks/useData.js'

const STATUS_COLS = [
  { id: 'todo', label: 'To Do', color: 'var(--text-dim)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--accent)' },
  { id: 'done', label: 'Done', color: 'var(--success)' },
]

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function PriorityBadge({ priority }) {
  return <span className={`priority priority-${priority}`}>{priority}</span>
}

export default function Tasks() {
  const { data, loading } = useData('tasks.json')
  const [view, setView] = useState('list')
  const [filterStatus, setFilterStatus] = useState('all')

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.1em' }}>LOADING...</div>
    </div>
  )

  const tasks = data?.tasks ?? []
  const filtered = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus)
  const sorted = [...filtered].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3))

  const counts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Tasks & Ops</div>
        <div className="page-subtitle">Mission Control</div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '14px' }}>
        {STATUS_COLS.map(col => (
          <div
            key={col.id}
            className="stat-card"
            style={{ cursor: 'pointer', borderColor: filterStatus === col.id ? col.color : undefined, textAlign: 'center' }}
            onClick={() => setFilterStatus(filterStatus === col.id ? 'all' : col.id)}
          >
            <div className="stat-value" style={{ fontSize: '28px', color: col.color, textShadow: `0 0 15px ${col.color}` }}>
              {counts[col.id]}
            </div>
            <div className="stat-label" style={{ fontSize: '9px' }}>{col.label}</div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {['list', 'kanban'].map(v => (
          <button
            key={v}
            className={`btn ${view === v ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            style={{ flex: 1 }}
            onClick={() => setView(v)}
          >
            {v === 'list' ? '☰ List' : '⊞ Board'}
          </button>
        ))}
      </div>

      {view === 'list' && (
        <div className="stack">
          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
            {['all', 'todo', 'in-progress', 'done'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filterStatus === f ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === 'all' ? 'All' : f === 'todo' ? 'To Do' : f === 'in-progress' ? 'In Progress' : 'Done'}
              </button>
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">
                {filterStatus === 'done' ? 'No completed tasks' : 'Nothing here — mission clear'}
              </div>
            </div>
          ) : sorted.map((task, i) => (
            <div key={task.id ?? i} className="panel">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: task.status === 'done' ? 'var(--text-dim)' : 'var(--text-primary)',
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    lineHeight: 1.4,
                  }}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {task.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <PriorityBadge priority={task.priority} />
                    {task.project && <span className="tag">{task.project}</span>}
                    {task.due && (
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                        Due: {new Date(task.due + 'T00:00:00').toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-secondary)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: task.status === 'done' ? 'var(--success)' : task.status === 'in-progress' ? 'var(--accent)' : 'var(--text-dim)',
                  whiteSpace: 'nowrap',
                  paddingTop: '2px',
                }}>
                  {task.status === 'in-progress' ? 'Active' : task.status === 'done' ? 'Done ✓' : 'Queue'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'kanban' && (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {STATUS_COLS.map(col => {
            const colTasks = tasks
              .filter(t => t.status === col.id)
              .sort((a,b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3))
            return (
              <div key={col.id} style={{ minWidth: '160px', flex: 1 }}>
                <div className="kanban-header" style={{ color: col.color }}>
                  <span>{col.label}</span>
                  <span className="kanban-count" style={{ color: col.color, borderColor: col.color }}>{colTasks.length}</span>
                </div>
                {colTasks.map((task, i) => (
                  <div key={task.id ?? i} className="kanban-card">
                    <div className="kanban-card-title">{task.title}</div>
                    <div className="kanban-card-meta" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-dim)', fontSize: '11px' }}>Empty</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Guide */}
      <div className="panel" style={{ marginTop: '16px', marginBottom: '14px' }}>
        <div className="panel-title">How to Add Tasks</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Tell FRIDAY: <em style={{ color: 'var(--text-primary)' }}>"Add a high priority task: [title] to the [project] project"</em>
          <br />or edit <code style={{ color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', padding: '1px 5px', borderRadius: '3px' }}>/public/data/tasks.json</code> directly.
        </div>
      </div>

      <div style={{ height: '8px' }} />
    </div>
  )
}
