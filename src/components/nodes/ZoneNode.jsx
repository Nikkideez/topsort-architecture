import React from 'react'
import { NodeResizer } from '@xyflow/react'

export default function ZoneNode({ data, selected }) {
  const { label, color = '#a78bfa', editing } = data
  return (
    <>
      {editing && (
        <NodeResizer
          isVisible={selected}
          minWidth={100}
          minHeight={60}
          lineStyle={{ border: `1px solid ${color}44` }}
          handleStyle={{ background: color, width: 8, height: 8, borderRadius: 2 }}
        />
      )}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: 10,
        border: `1px solid ${color}33`,
        background: `${color}08`,
        pointerEvents: editing ? 'auto' : 'none',
      }}>
        <div style={{
          padding: '8px 14px',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color,
          fontFamily: 'var(--mono)',
          textTransform: 'uppercase',
        }}>{label}</div>
      </div>
    </>
  )
}
