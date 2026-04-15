import { useState } from 'react'
import { BASE, apiRequest } from '../services/api'

interface Props {
  onLinkCreated: () => void
}

type FlashState = { type: 'err' | 'ok'; msg: string } | null

export default function ShortenPanel({ onLinkCreated }: Props) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [flash, setFlash] = useState<FlashState>(null)
  const [copied, setCopied] = useState(false)

  function showFlash(type: 'err' | 'ok', msg: string) {
    setFlash({ type, msg })
    if (type === 'ok') setTimeout(() => setFlash(null), 3000)
  }

  async function doShorten() {
    setFlash(null)
    const long = url.trim()
    if (!long) { showFlash('err', 'Please enter a URL.'); return }
    if (!/^https?:\/\//i.test(long)) { showFlash('err', 'URL must start with http:// or https://'); return }

    setLoading(true)
    try {
      const d = await apiRequest<{ short_url: string }>('/', {
        method: 'POST',
        body: JSON.stringify({ long_url: long }),
      })
      const short = `${BASE}/url-mapping/${d.short_url}`
      setResult(short)
      setUrl('')
      showFlash('ok', 'Link created!')
      setTimeout(onLinkCreated, 400)
    } catch (e) {
      showFlash('err', (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function copyResult() {
    if (!result) return
    if (navigator.clipboard) {
      navigator.clipboard.writeText(result).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
    } else {
      const el = document.createElement('textarea')
      el.value = result
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <>
      <div className="field">
        <label className="field-label">Long URL</label>
        <input
          className="inp"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doShorten()}
          placeholder="https://paste-your-long-url-here.com/path"
        />
      </div>
      <button className="btn-main" onClick={doShorten} disabled={loading}>
        {loading ? 'Shortening…' : 'Shorten Link'}
      </button>

      {result && (
        <div className="result show">
          <span className="result-url">{result}</span>
          <button className={`btn-act${copied ? ' copied' : ''}`} onClick={copyResult}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <a className="btn-act" href={result} target="_blank" rel="noopener noreferrer">Open ↗</a>
        </div>
      )}

      {flash && <div className={`flash ${flash.type}`}>{flash.msg}</div>}
    </>
  )
}
