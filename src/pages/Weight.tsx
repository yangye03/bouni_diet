import { useState } from 'react'
import { useData } from '../store/DataContext'
import { Card } from '../components/Card'
import { daysBetween, prettyDate, todayStr } from '../utils/date'

export function Weight() {
  const { weightLogs, settings, addWeightLog, deleteWeightLog } = useData()

  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(todayStr())
  const [note, setNote] = useState('')

  const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date))
  const latest = sorted[sorted.length - 1]
  const latestWeight = latest?.weightKg ?? settings.currentWeight
  const target = settings.targetWeight
  const remaining = latestWeight - target

  let weeklyChangeKg: number | null = null
  let weeklyMsg = '数据不足，需要至少两次记录'
  if (sorted.length >= 2) {
    const ref = sorted[sorted.length - 1]
    let older = null
    for (let i = sorted.length - 2; i >= 0; i--) {
      if (daysBetween(sorted[i].date, ref.date) >= 7) {
        older = sorted[i]
        break
      }
    }
    if (older) {
      const days = daysBetween(older.date, ref.date)
      const deltaKg = ref.weightKg - older.weightKg
      weeklyChangeKg = (deltaKg / days) * 7
      weeklyMsg = `近 ${days} 天变化 ${(deltaKg * 1000).toFixed(0)} g，相当于每周 ${(weeklyChangeKg * 1000).toFixed(0)} g`
    } else {
      weeklyMsg = '数据不足，需要两次间隔 ≥7 天的记录'
    }
  }

  const warnings: { text: string; tone: 'warn' | 'danger' | 'success' }[] = []
  if (latest && latest.weightKg > settings.currentWeight) {
    warnings.push({ text: '体重上升，建议检查最近摄入', tone: 'warn' })
  }
  if (weeklyChangeKg != null && weeklyChangeKg * 1000 < -120) {
    warnings.push({ text: '减重速度可能过快，建议增加热量或咨询兽医', tone: 'danger' })
  }
  if (latest && Math.abs(latest.weightKg - target) <= 0.15) {
    warnings.push({ text: '接近目标体重，可以准备进入维持期', tone: 'success' })
  }

  function handleSave() {
    const w = parseFloat(weight)
    if (!(w > 0)) return
    addWeightLog({ date, weightKg: w, note: note.trim() || undefined })
    setWeight('')
    setNote('')
    setDate(todayStr())
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">体重记录</h1>
      </header>

      <Card className="weight-card">
        <div className="weight-big">
          <span className="weight-num">{latestWeight.toFixed(2)}</span>
          <span className="unit">kg</span>
        </div>
        <div className="weight-target-row">
          <span>目标 {target.toFixed(2)} kg</span>
          <span>{remaining > 0 ? `还需减 ${(remaining * 1000).toFixed(0)} g` : '已达标 🎉'}</span>
        </div>
      </Card>

      {warnings.length > 0 && (
        <div className="warnings">
          {warnings.map((w, i) => (
            <div key={i} className={`warning ${w.tone}`}>
              {w.text}
            </div>
          ))}
        </div>
      )}

      <Card className="weekly-card">
        <div className="weekly-title">周变化</div>
        <div className="weekly-msg">{weeklyMsg}</div>
      </Card>

      <Card className="form-card">
        <label className="field">
          <span className="field-label">体重 (kg)</span>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="例如 6.25"
          />
        </label>
        <label className="field">
          <span className="field-label">日期</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">备注（可选）</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="例如 晚上称的"
          />
        </label>
        <button className="primary-btn" disabled={!(parseFloat(weight) > 0)} onClick={handleSave}>
          记录体重
        </button>
      </Card>

      <div className="section-header">
        <h2>历史记录</h2>
      </div>
      <div className="log-list">
        {[...sorted].reverse().map((l) => (
          <Card key={l.id} className="log-item">
            <div className="log-main">
              <div className="log-name">{l.weightKg.toFixed(2)} kg</div>
              <div className="log-meta">
                {prettyDate(l.date)} · {l.date}
              </div>
              {l.note && <div className="log-note">{l.note}</div>}
            </div>
            <button className="log-delete" onClick={() => deleteWeightLog(l.id)}>
              删除
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
