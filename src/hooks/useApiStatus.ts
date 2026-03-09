import { useState, useEffect } from 'react'
import { BASE } from '../services/api'
import type { ApiStatus } from '../types'

export function useApiStatus(): ApiStatus {
  const [status, setStatus] = useState<ApiStatus>('unknown')

  useEffect(() => {
    async function ping() {
      try {
        await fetch(`${BASE}/url-mapping/`, { signal: AbortSignal.timeout(3000) })
        setStatus('online')
      } catch {
        setStatus('offline')
      }
    }
    ping()
  }, [])

  return status
}
