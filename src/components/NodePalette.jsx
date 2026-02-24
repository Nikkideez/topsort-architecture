import React from 'react'
import { Panel, useReactFlow } from '@xyflow/react'

const NODE_TEMPLATES = [
  { label: 'Service', type: 'service', data: { label: 'New Service', subtitle: '', borderColor: '#a78bfa' } },
  { label: 'Data Store', type: 'datastore', data: { label: 'New Store', subtitle: '' } },
  { label: 'External', type: 'external', data: { label: 'New External', subtitle: '', borderColor: '#4f8ff7' } },
]

export default function NodePalette({ onAddNode }) {
  const { screenToFlowPosition, getViewport } = useReactFlow()

  const handleAdd = (template) => {
    // Place new node near viewport center
    const vp = getViewport()
    const centerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = screenToFlowPosition(centerScreen)

    const node = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      position: { x: Math.round(pos.x), y: Math.round(pos.y) },
      data: { ...template.data },
    }
    onAddNode(node)
  }

  return (
    <Panel position="bottom-left" className="node-palette">
      {NODE_TEMPLATES.map(t => (
        <button key={t.type} className="palette-btn" onClick={() => handleAdd(t)}>
          + {t.label}
        </button>
      ))}
    </Panel>
  )
}
