import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import Diet from './components/Diet.jsx'
import Gym from './components/Gym.jsx'
import Tasks from './components/Tasks.jsx'
import Calendar from './components/Calendar.jsx'

const NAV = [
  {
    path: '/',
    label: 'HQ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  {
    path: '/diet',
    label: 'Diet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    path: '/gym',
    label: 'Gym',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 9l2 3-2 3M22 9l-2 3 2 3"/>
      </svg>
    )
  },
  {
    path: '/tasks',
    label: 'Ops',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
        <path d="M3 17l2 2 4-4"/>
      </svg>
    )
  },
  {
    path: '/calendar',
    label: 'Intel',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
]

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="app-layout">
      <div className="hex-bg" />

      <main className="main-content fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </main>

      <nav className="nav-bar">
        <div className="nav-inner">
          {NAV.map(n => (
            <button
              key={n.path}
              className={`nav-item ${location.pathname === n.path ? 'active' : ''}`}
              onClick={() => navigate(n.path)}
            >
              {n.icon}
              {n.label}
              <div className="nav-dot" />
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
