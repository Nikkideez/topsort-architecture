import React from 'react'

export default function StaticSection({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
