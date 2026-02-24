import React from 'react'
import { Handle, Position } from '@xyflow/react'

const handleStyle = (color) => ({ background: color, width: 6, height: 6 })

export default function ServiceNode({ data }) {
  const { label, subtitle, badge, borderColor = '#a78bfa', dimmed } = data
  const hs = handleStyle(borderColor)
  return (
    <div style={{
      background: '#161a30',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 8,
      padding: '8px 14px',
      minWidth: 130,
      opacity: dimmed ? 0.15 : 1,
      transition: 'opacity 0.3s',
    }}>
      {badge && (
        <div style={{
          fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: borderColor, marginBottom: 3,
          fontFamily: 'var(--mono)',
        }}>{badge}</div>
      )}
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#eef0f6', textAlign: 'center' }}>{label}</div>
      {subtitle && (
        <div style={{ fontSize: '0.55rem', color: '#5c6178', textAlign: 'center', fontFamily: 'var(--mono)', marginTop: 2 }}>{subtitle}</div>
      )}
      <Handle type="target" position={Position.Top} id="top" style={hs} />
      <Handle type="source" position={Position.Top} id="top" style={{ ...hs, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} id="bottom" style={hs} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...hs, left: '50%' }} />
      <Handle type="target" position={Position.Left} id="left" style={hs} />
      <Handle type="source" position={Position.Left} id="left" style={{ ...hs, top: '50%' }} />
      <Handle type="source" position={Position.Right} id="right" style={hs} />
      <Handle type="target" position={Position.Right} id="right" style={{ ...hs, top: '50%' }} />
    </div>
  )
}
