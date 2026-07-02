import { useState } from 'react'
import { useData } from '../store/DataContext'
import { Card } from '../components/Card'
import { todayStr } from '../utils/date'
import { calcLogKcal, foodCanCalculate, formatGrams, formatKcal } from '../utils/calories'

export function AddLog() {
  const { foods, addFoodLog } = useData()
  const calculableFoods = foods.filter(foodCanCalculate)

  const [foodId, setFoodId] = useState(calculableFoods[0]?.id ?? '')
  const [grams, setGrams] = useState('')
  const [units, setUnits] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayStr())
  const [saved, setSaved] = useState(false)

  const selected = foods.find((f) => f.id === foodId)
  const gramsNum = parseFloat(grams) || 0
  const unitsNum = parseFloat(units) || 0
  const kcal = selected ? calcLogKcal(selected, { grams: gramsNum, units: unitsNum }) : 0
  const canSave = !!selected && kcal > 0 && (gramsNum > 0 || unitsNum > 0)

  function handleSave() {
    if (!selected || !canSave) return
    addFoodLog({
      date,
      foodId: selected.id,
      foodName: selected.name,
      grams: gramsNum,
      kcal,
      note: note.trim() || undefined,
    })
    setGrams('')
    setUnits('')
    setNote('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (calculableFoods.length === 0) {
    return (
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">记录进食</h1>
        </header>
        <Card className="empty">食物库中还没有可计算热量的食物，请先到「食物」页面添加。</Card>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">记录进食</h1>
      </header>

      <Card className="form-card">
        <label className="field">
          <span className="field-label">食物</span>
          <select value={foodId} onChange={(e) => setFoodId(e.target.value)}>
            {calculableFoods.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        {selected?.kcalPerGram != null && (
          <label className="field">
            <span className="field-label">克数 (g)</span>
            <input
              type="number"
              inputMode="decimal"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="例如 30"
            />
          </label>
        )}

        {selected?.kcalPerUnit != null && (
          <label className="field">
            <span className="field-label">数量（{selected.unitName ?? '份'}）</span>
            <input
              type="number"
              inputMode="decimal"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="例如 1"
            />
          </label>
        )}

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
            placeholder="例如 上午喂的"
          />
        </label>

        <div className="preview">
          <div className="preview-left">
            <span className="preview-label">预计热量</span>
            {kcal > 0 ? (
              <span className="preview-formula">
                {gramsNum > 0 && selected?.kcalPerGram != null && (
                  <span>{formatGrams(gramsNum)} g × {selected.kcalPerGram} kcal/g</span>
                )}
                {unitsNum > 0 && selected?.kcalPerUnit != null && (
                  <span>{formatGrams(unitsNum)} {selected.unitName ?? '份'} × {selected.kcalPerUnit} kcal</span>
                )}
                <span className="formula-eq">=</span>
              </span>
            ) : (
              <span className="preview-formula muted">填写克数或数量后显示计算依据</span>
            )}
          </div>
          <span className="preview-kcal">{formatKcal(kcal)} kcal</span>
        </div>

        <button className="primary-btn" disabled={!canSave} onClick={handleSave}>
          保存记录
        </button>
        {saved && <div className="saved-msg">已保存 ✓</div>}
      </Card>
    </div>
  )
}
