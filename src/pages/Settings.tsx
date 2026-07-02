import { useState } from 'react'
import { useData } from '../store/DataContext'
import { Card } from '../components/Card'

export function SettingsPage() {
  const { settings, updateSettings, resetAll } = useData()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  const dirty = JSON.stringify(form) !== JSON.stringify(settings)

  function save() {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const num = (v: string) => (v === '' ? 0 : parseFloat(v) || 0)

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">设置</h1>
      </header>

      <Card className="form-card">
        <label className="field">
          <span className="field-label">猫咪名字</span>
          <input type="text" value={form.catName} onChange={(e) => setForm({ ...form, catName: e.target.value })} />
        </label>
        <label className="field">
          <span className="field-label">基准体重 (kg)</span>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={form.currentWeight}
            onChange={(e) => setForm({ ...form, currentWeight: num(e.target.value) })}
          />
        </label>
        <label className="field">
          <span className="field-label">目标体重 (kg)</span>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={form.targetWeight}
            onChange={(e) => setForm({ ...form, targetWeight: num(e.target.value) })}
          />
        </label>
        <label className="field">
          <span className="field-label">每日热量目标 (kcal)</span>
          <input
            type="number"
            inputMode="decimal"
            value={form.dailyCalorieTarget}
            onChange={(e) => setForm({ ...form, dailyCalorieTarget: num(e.target.value) })}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span className="field-label">安全下限 (kcal)</span>
            <input
              type="number"
              inputMode="decimal"
              value={form.safeRangeMin}
              onChange={(e) => setForm({ ...form, safeRangeMin: num(e.target.value) })}
            />
          </label>
          <label className="field">
            <span className="field-label">安全上限 (kcal)</span>
            <input
              type="number"
              inputMode="decimal"
              value={form.safeRangeMax}
              onChange={(e) => setForm({ ...form, safeRangeMax: num(e.target.value) })}
            />
          </label>
        </div>
        <button className="primary-btn" disabled={!dirty} onClick={save}>
          保存设置
        </button>
        {saved && <div className="saved-msg">已保存 ✓</div>}
      </Card>

      <Card className="danger-card">
        <div className="info-title">重置数据</div>
        <p className="muted">清空所有进食记录、体重记录与自定义食物，恢复默认设置。</p>
        <button
          className="danger-btn"
          onClick={() => {
            if (confirm('确定要清空所有数据吗？此操作不可撤销。')) resetAll()
          }}
        >
          清空并重置
        </button>
      </Card>
    </div>
  )
}
