import React, { useState } from 'react'
import { Panel } from '@xyflow/react'

export default function EditToolbar({ editing, onEdit, onCancel, onSave, onReset, onExport }) {
  const [exported, setExported] = useState(false)

  if (!editing) {
    return (
      <Panel position="top-right" className="edit-toolbar">
        <button className="edit-btn" onClick={onEdit}>Edit Layout</button>
      </Panel>
    )
  }

  const handleExport = () => {
    onExport?.()
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <Panel position="top-right" className="edit-toolbar editing">
      <button className="edit-btn edit-btn-cancel" onClick={onCancel}>Cancel</button>
      <button className="edit-btn edit-btn-save" onClick={onSave}>Save</button>
      <button className="edit-btn edit-btn-reset" onClick={onReset}>Reset to Default</button>
      {onExport && (
        <button className="edit-btn" onClick={handleExport}>
          {exported ? 'Copied!' : 'Export'}
        </button>
      )}
    </Panel>
  )
}
