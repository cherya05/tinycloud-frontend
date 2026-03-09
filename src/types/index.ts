export interface Link {
  id: number
  short_url: string
  long_url: string
  created_at: string
}

export type ApiStatus = 'unknown' | 'online' | 'offline'
