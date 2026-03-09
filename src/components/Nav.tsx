import type { ApiStatus } from '../types'

interface Props {
  status: ApiStatus
}

export default function Nav({ status }: Props) {
  const dotClass = status === 'online' ? 'dot on' : status === 'offline' ? 'dot off' : 'dot'
  const label = status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'API'

  return (
    <nav>
      <a className="logo" href="#">
        <div className="logo-mark">☁</div>
        tinycloud
      </a>
      <div className="nav-links">
        <a href="#links">Links</a>
        <a href="#">Docs</a>
      </div>
      <div className="api-badge">
        <div className={dotClass} />
        <span>{label}</span>
      </div>
    </nav>
  )
}
