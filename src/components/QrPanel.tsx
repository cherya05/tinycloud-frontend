import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import { BASE } from '../services/api'

type FlashState = { type: 'err' | 'ok'; msg: string } | null

export default function QrPanel() {
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [generated, setGenerated] = useState(false)
  const [flash, setFlash] = useState<FlashState>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  async function doQR() {
    setFlash(null)
    const raw = url.trim()
    if (!raw) { setFlash({ type: 'err', msg: 'Enter a URL.' }); return }
    const target = /^https?:\/\//i.test(raw) ? raw : `${BASE}/${raw}`

    try {
      await QRCode.toCanvas(canvasRef.current!, target, {
        width: 200,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })
      setLabel(target.replace(/^https?:\/\//, ''))
      setGenerated(true)
    } catch (e) {
      setFlash({ type: 'err', msg: (e as Error).message })
    }
  }

  function dlQR() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'tinycloud-qr.png'
    a.click()
  }

  return (
    <>
      <div className="field">
        <label className="field-label">URL or Short Code</label>
        <div className="qr-row">
          <input
            className="inp"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doQR()}
            placeholder="https://your-url.com or short code"
          />
          <button className="btn-gen" onClick={doQR}>Generate</button>
        </div>
      </div>

      {flash && <div className={`flash ${flash.type}`}>{flash.msg}</div>}

      <div className={`qr-out${generated ? ' show' : ''}`}>
        <div className="qr-canvas-wrap">
          <canvas ref={canvasRef} />
        </div>
        {label && <span className="qr-lbl">{label}</span>}
        <button className="btn-dl" onClick={dlQR}>↓ Download PNG</button>
      </div>
    </>
  )
}
