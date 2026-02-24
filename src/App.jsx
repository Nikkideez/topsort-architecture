import React, { useState, useRef, useCallback } from 'react'
import OverviewSection from './sections/Overview.jsx'
import ArchitectureSection from './sections/Architecture.jsx'
import LifecycleSection from './sections/Lifecycle.jsx'
import StaticSection from './sections/StaticSection.jsx'

import { api } from './sections/api.js'

const sections = [
  { id: 'overview', label: 'Overview', icon: '1', component: OverviewSection },
  { id: 'architecture', label: 'Architecture', icon: '2', component: ArchitectureSection },
  { id: 'lifecycle', label: 'Lifecycle', icon: '3', component: LifecycleSection },
  { id: 'api', label: 'API Reference', icon: '4', html: api },
]

export default function App() {
  const [activeId, setActiveId] = useState('overview')
  const tabsRef = useRef(null)

  const showSection = useCallback((id) => {
    setActiveId(id)
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="root">
      <div className="hero">
        <h1><span className="g">Topsort</span> — <span className="b">Architecture Reference</span></h1>
        <p className="sub">System overview, integration architecture, lifecycle, and API reference for the Topsort retail media platform.</p>
      </div>

      <div className="tabs" ref={tabsRef}>
        {sections.map(s => (
          <button
            key={s.id}
            className={`tab${activeId === s.id ? ' active' : ''}`}
            onClick={() => showSection(s.id)}
          >
            <span className="tn">{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      <div id="app">
        {sections.map(s => {
          const isVisible = activeId === s.id
          if (s.component) {
            const Comp = s.component
            return (
              <div key={s.id} className={`section${isVisible ? ' vis' : ''}`} id={`sec-${s.id}`}>
                {isVisible && <Comp />}
              </div>
            )
          }
          return (
            <div key={s.id} className={`section${isVisible ? ' vis' : ''}`} id={`sec-${s.id}`}>
              {isVisible && <StaticSection html={s.html} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
