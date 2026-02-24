import React from 'react'
import { Handle, Position } from '@xyflow/react'

const hs = { background: '#fbbf24', width: 5, height: 5 }

export default function DataStoreNode({ data }) {
  const { label, subtitle, dimmed } = data
  return (
    <div style={{
      background: '#1a1a10',
      border: '1px solid #fbbf24',
      borderRadius: 8,
      padding: '6px 12px',
      minWidth: 110,
      opacity: dimmed ? 0.15 : 1,
      transition: 'opacity 0.3s',
    }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#eef0f6', textAlign: 'center' }}>{label}</div>
      {subtitle && (
        <div style={{ fontSize: '0.52rem', color: '#5c6178', textAlign: 'center', fontFamily: 'var(--mono)', marginTop: 2 }}>{subtitle}</div>
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
