interface Props {
  value: number
  max: number
  tone?: 'normal' | 'over'
}

export function ProgressBar({ value, max, tone = 'normal' }: Props) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemax={100}>
      <div className={`progress-fill ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
