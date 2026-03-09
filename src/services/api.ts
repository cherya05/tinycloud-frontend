export const BASE = window.location.origin

export async function apiRequest<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${BASE}/url-mapping${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  const isJson = r.headers.get('content-type')?.includes('application/json') ?? false
  const d = isJson ? await r.json().catch(() => ({})) : {}
  if (!r.ok) throw new Error((d as Record<string, string>).error || (d as Record<string, string>).message || `HTTP ${r.status}`)
  return d as T
}
