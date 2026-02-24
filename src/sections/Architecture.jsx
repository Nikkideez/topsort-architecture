import React from 'react'
import ArchitectureDiagram from '../diagrams/ArchitectureDiagram'

export default function ArchitectureSection() {
  return (
    <div>
      <div className="sh">
        <h2>Full Architecture Diagram</h2>
        <p className="sd">Click a flow to highlight the request path. Click "Edit Layout" to drag and rearrange nodes.</p>
      </div>
      <ArchitectureDiagram />
    </div>
  )
}
