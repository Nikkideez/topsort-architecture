import React from 'react'
import ArchitectureDiagram from '../diagrams/ArchitectureDiagram'

export default function ArchitectureSection() {
  return (
    <div>
      <div className="sh">
        <h2>Full Architecture Diagram</h2>
        <p className="sd">Drag nodes to rearrange. Click a flow to highlight the request path. Positions are saved automatically.</p>
      </div>
      <ArchitectureDiagram />
    </div>
  )
}
