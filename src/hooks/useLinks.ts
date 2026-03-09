import { useState, useEffect } from 'react'
import { apiRequest } from '../services/api'
import type { Link } from '../types'

export function useLinks(refreshKey: number) {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [refreshKey])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const arr = await apiRequest<Link[]>('/')
      setLinks(arr)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteLink(id: number) {
    if (!confirm('Delete this link?')) return
    try {
      await apiRequest(`/${id}`, { method: 'DELETE' })
      setLinks(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return { links, loading, error, reload: load, deleteLink }
}
