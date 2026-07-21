'use client'
import { useState, useEffect } from 'react'

const CMS_API = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:8090'

export function useSectionContent(page, type, fallback = {}) {
  const [content, setContent] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch(`${CMS_API}/api/sections/public/${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        const section = data?.sections?.find((s) => s.type === type)
        if (section?.content) {
          setContent({ ...fallback, ...section.content })
        }
      })
      .catch(() => {
        // silent fail — fallback content already set
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [page, type])

  return { content, loading }
}
