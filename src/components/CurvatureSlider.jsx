import React from 'react'
import { Panel } from '@xyflow/react'

const HANDLE_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const selectStyle = {
  background: '#1a1e30',
  color: '#c0c4d8',
  border: '1px solid #2a2e42',
  borderRadius: 4,
  padding: '2px 4px',
  fontSize: '0.7rem',
  fontFamily: 'var(--mono)',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
}

export default function CurvatureSlider({ edgeId, value, onChange, onClose, edgeData, onHandleChange }) {
  if (!edgeId) return null

  return (
    <Panel position="bottom-center" className="curvature-slider">
      <div className="curvature-slider-header">
        <span className="curvature-slider-label">Edge: {edgeId}</span>
        <button className="curvature-slider-close" onClick={onClose}>&times;</button>
      </div>
      <div className="curvature-slider-body">
        <span style={{ fontSize: '0.65rem', color: '#5c6178', minWidth: 55 }}>Curvature</span>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
        <span className="curvature-slider-value">{value.toFixed(2)}</span>
      </div>
      {edgeData && onHandleChange && (
        <div style={{ display: 'flex', gap: 8, padding: '4px 0 2px', alignItems: 'center' }}>
          <label style={{ fontSize: '0.65rem', color: '#5c6178', minWidth: 55 }}>Source</label>
          <select
            style={selectStyle}
            value={edgeData.sourceHandle || ''}
            onChange={e => onHandleChange('sourceHandle', e.target.value)}
          >
            {HANDLE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <label style={{ fontSize: '0.65rem', color: '#5c6178', minWidth: 55 }}>Target</label>
          <select
            style={selectStyle}
            value={edgeData.targetHandle || ''}
            onChange={e => onHandleChange('targetHandle', e.target.value)}
          >
            {HANDLE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}
    </Panel>
  )
}
