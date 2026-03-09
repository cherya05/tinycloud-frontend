import { useState } from 'react'
import { useApiStatus } from './hooks/useApiStatus'
import Nav from './components/Nav'
import ShortenPanel from './components/ShortenPanel'
import QrPanel from './components/QrPanel'
import LinksSection from './components/LinksSection'
import EditModal from './components/EditModal'

interface EditState {
  open: boolean
  id: number
  url: string
}

export default function App() {
  const apiStatus = useApiStatus()
  const [activeTab, setActiveTab] = useState<'shorten' | 'qr'>('shorten')
  const [refreshKey, setRefreshKey] = useState(0)
  const [editState, setEditState] = useState<EditState>({ open: false, id: 0, url: '' })

  function refresh() {
    setRefreshKey((k: number) => k + 1)
  }

  function openEdit(id: number, url: string) {
    setEditState({ open: true, id, url })
  }

  function closeEdit() {
    setEditState((s: EditState) => ({ ...s, open: false }))
  }

  return (
    <>
      <div className="scene">
        <div className="glow g1" />
        <div className="glow g2" />
      </div>

      <div className="page">
        <Nav status={apiStatus} />

        <div className="hero">
          <div className="eyebrow">Your personal link infrastructure</div>
          <h1>Short links.<br /><strong>Big reach.</strong></h1>
          <p className="hero-sub">
            Shorten URLs, generate QR codes, and manage every link — powered by your own TinyCloud API.
          </p>

          <div className="card-wrap">
            <div className="card">
              <div className="tabs">
                <button
                  className={`tab${activeTab === 'shorten' ? ' active' : ''}`}
                  onClick={() => setActiveTab('shorten')}
                >
                  <span>✂</span> Shorten a Link
                </button>
                <button
                  className={`tab${activeTab === 'qr' ? ' active' : ''}`}
                  onClick={() => setActiveTab('qr')}
                >
                  <span>⊞</span> Generate QR Code
                </button>
              </div>

              <div className={`panel${activeTab === 'shorten' ? ' active' : ''}`}>
                <ShortenPanel onLinkCreated={refresh} />
              </div>
              <div className={`panel${activeTab === 'qr' ? ' active' : ''}`}>
                <QrPanel />
              </div>
            </div>
          </div>
        </div>

        <LinksSection refreshKey={refreshKey} onEditClick={openEdit} />

        <footer>
          <span>tinycloud © 2025</span>
        </footer>
      </div>

      <EditModal
        open={editState.open}
        id={editState.id}
        initialUrl={editState.url}
        onClose={closeEdit}
        onSaved={() => { closeEdit(); refresh() }}
      />
    </>
  )
}
