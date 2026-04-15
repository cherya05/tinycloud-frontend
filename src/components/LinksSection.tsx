import { BASE } from '../services/api'
import { fmtDate } from '../utils/date'
import { useLinks } from '../hooks/useLinks'

interface Props {
  refreshKey: number
  onEditClick: (id: number, url: string) => void
}

function Skeleton() {
  return (
    <div className="skel">
      {[1, 2, 3, 4].map(i => (
        <div className="skel-row" key={i}>
          <div className="bone" style={{ width: 90 + (i * 17) % 60 }} />
          <div className="bone" />
          <div className="bone" style={{ width: 80 }} />
          <div className="bone" style={{ width: 60 }} />
        </div>
      ))}
    </div>
  )
}

export default function LinksSection({ refreshKey, onEditClick }: Props) {
  const { links, loading, error, reload, deleteLink } = useLinks(refreshKey)

  function qCopy(url: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
    } else {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  const count = links.length
  const countLabel = loading ? '—' : `${count} link${count !== 1 ? 's' : ''}`

  return (
    <div className="section" id="links">
      <div className="sec-head">
        <span className="sec-title">Your Links</span>
        <div className="sec-meta">
          <span>{countLabel}</span>
          <button className="btn-ref" onClick={reload}>↺ Refresh</button>
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <div className="empty">
          <div className="empty-ic">⚠</div>
          {error}
        </div>
      ) : links.length === 0 ? (
        <div className="empty">
          <div className="empty-ic">🔗</div>
          No links yet — shorten your first URL above.
        </div>
      ) : (
        <div className="links">
          {links.map(l => {
            const short = `${BASE}/url-mapping/${l.short_url}`
            return (
              <div className="lrow" key={l.id}>
                <span className="lshort" title={short}>{l.short_url}</span>
                <span className="lorig" title={l.long_url}>{l.long_url}</span>
                <span className="ldate">{fmtDate(l.created_at)}</span>
                <div className="lact">
                  <button className="ra" onClick={() => qCopy(short)}>Copy</button>
                  <button className="ra" onClick={() => onEditClick(l.id, l.long_url)}>Edit</button>
                  <button className="ra del" onClick={() => deleteLink(l.id)}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
