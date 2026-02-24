import React from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'

export default function LabeledEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, style, selected,
}) {
  const { label, color = '#4f8ff7', dashed, dimmed, curvature } = data || {}

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    curvature: curvature ?? 0.25,
  })

  return (
    <>
      {selected && (
        <BaseEdge
          id={`${id}-glow`}
          path={edgePath}
          style={{
            stroke: color,
            strokeWidth: 8,
            opacity: dimmed ? 0 : 0.3,
            filter: 'blur(4px)',
            transition: 'opacity 0.3s',
          }}
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: dashed ? '6 4' : undefined,
          opacity: dimmed ? 0.08 : 1,
          transition: 'opacity 0.3s, stroke-width 0.2s',
          ...style,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: '0.55rem',
              fontFamily: 'var(--mono)',
              fontWeight: 600,
              color,
              background: '#08090dee',
              padding: '1px 5px',
              borderRadius: 3,
              pointerEvents: 'none',
              opacity: dimmed ? 0.08 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
