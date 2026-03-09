import { useState, useEffect, useRef, type MouseEvent } from 'react'
import { apiRequest } from '../services/api'

interface Props {
  open: boolean
  id: number
  initialUrl: string
  onClose: () => void
  onSaved: () => void
}

export default function EditModal({ open, id, initialUrl, onClose, onSaved }: Props) {
  const [url, setUrl] = useState(initialUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUrl(initialUrl)
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, initialUrl])

  async function saveEdit() {
    const trimmed = url.trim()
    if (!trimmed) return
    try {
      await apiRequest(`/${id}`, { method: 'PUT', body: JSON.stringify({ long_url: trimmed }) })
      onSaved()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  function onBgClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={`modal-bg${open ? ' open' : ''}`} onClick={onBgClick}>
      <div className="modal">
        <div className="modal-title">Edit Link</div>
        <div className="field">
          <label className="field-label">New Destination URL</label>
          <input
            ref={inputRef}
            className="inp"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            placeholder="https://new-destination.com"
          />
        </div>
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={saveEdit}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}
