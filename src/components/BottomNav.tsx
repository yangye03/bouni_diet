interface Props {
  current: string
  onChange: (tab: string) => void
}

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5V21H3z" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
)
const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const BoxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="14" rx="2" />
    <path d="M4 10h16" />
  </svg>
)
const ScaleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4a3 3 0 0 1 3 3v1H9V7a3 3 0 0 1 3-3z" />
    <rect x="4" y="8" width="16" height="13" rx="2" />
    <path d="M9 14l2 2 4-4" />
  </svg>
)
const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
)

const tabs = [
  { id: 'today', label: '今日', Icon: HomeIcon },
  { id: 'log', label: '记录', Icon: PlusIcon },
  { id: 'food', label: '食物', Icon: BoxIcon },
  { id: 'weight', label: '体重', Icon: ScaleIcon },
  { id: 'settings', label: '设置', Icon: GearIcon },
]

export function BottomNav({ current, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${current === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          <span className="nav-icon">
            <Icon />
          </span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
