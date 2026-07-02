import { useState } from 'react'
import type { Food, FoodCategory } from '../types'
import { categoryLabels } from '../constants'
import { kcalPer100gToPerGram, kcalPerKgToPerGram } from '../utils/calories'
import { Card } from './Card'

type EntryMode = 'perKg' | 'per100g' | 'perUnit' | 'none'

interface Props {
  initial: Food | null
  onCancel: () => void
  onSave: (data: Omit<Food, 'id' | 'createdAt'>) => void
}

export function FoodForm({ initial, onCancel, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [brand, setBrand] = useState(initial?.brand ?? '')
  const [category, setCategory] = useState<FoodCategory>(initial?.category ?? 'dry')
  const [entryMode, setEntryMode] = useState<EntryMode>(
    initial?.kcalPerUnit != null
      ? 'perUnit'
      : initial?.kcalPerGram != null
        ? 'perKg'
        : 'none',
  )
  const [kcalPerKg, setKcalPerKg] = useState(
    initial?.kcalPerGram != null ? String(Math.round(initial.kcalPerGram * 1000)) : '',
  )
  const [kcalPer100g, setKcalPer100g] = useState(
    initial?.kcalPerGram != null ? String((initial.kcalPerGram * 100).toFixed(1)) : '',
  )
  const [kcalPerUnit, setKcalPerUnit] = useState(
    initial?.kcalPerUnit != null ? String(initial.kcalPerUnit) : '',
  )
  const [unitName, setUnitName] = useState(initial?.unitName ?? '')
  const [gramPerUnit, setGramPerUnit] = useState(
    initial?.gramPerUnit != null ? String(initial.gramPerUnit) : '',
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [defaultGrams, setDefaultGrams] = useState(
    initial?.defaultGrams != null ? String(initial.defaultGrams) : '',
  )

  function buildFood(): Omit<Food, 'id' | 'createdAt'> {
    const food: Omit<Food, 'id' | 'createdAt'> = {
      name: name.trim(),
      brand: brand.trim() || undefined,
      category,
      notes: notes.trim() || undefined,
      needsData: entryMode === 'none',
    }

    if (entryMode === 'perKg') {
      const v = parseFloat(kcalPerKg)
      if (v > 0) food.kcalPerGram = kcalPerKgToPerGram(v)
    } else if (entryMode === 'per100g') {
      const v = parseFloat(kcalPer100g)
      if (v > 0) food.kcalPerGram = kcalPer100gToPerGram(v)
    } else if (entryMode === 'perUnit') {
      const v = parseFloat(kcalPerUnit)
      if (v > 0) food.kcalPerUnit = v
      food.unitName = unitName.trim() || undefined
      const gpu = parseFloat(gramPerUnit)
      if (v > 0 && gpu > 0) {
        food.gramPerUnit = gpu
        food.kcalPerGram = v / gpu
      }
    }
    const dg = parseFloat(defaultGrams)
    if (dg > 0) food.defaultGrams = dg
    return food
  }

  const canSave = name.trim().length > 0

  return (
    <Card className="form-card food-form">
      <h2>{initial ? '编辑食物' : '添加食物'}</h2>

      <label className="field">
        <span className="field-label">食物名称 *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如 Orijen 室内伴侣猫粮"
        />
      </label>

      <label className="field">
        <span className="field-label">品牌</span>
        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="例如 Orijen" />
      </label>

      <label className="field">
        <span className="field-label">类别</span>
        <select value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)}>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">默认克数（固定食物，可选）</span>
        <input
          type="number"
          inputMode="decimal"
          value={defaultGrams}
          onChange={(e) => setDefaultGrams(e.target.value)}
          placeholder="例如 15，留空表示非固定"
        />
      </label>

      <div className="field">
        <span className="field-label">热量录入方式</span>
        <div className="mode-tabs">
          <button type="button" className={entryMode === 'perKg' ? 'active' : ''} onClick={() => setEntryMode('perKg')}>
            每 kg
          </button>
          <button type="button" className={entryMode === 'per100g' ? 'active' : ''} onClick={() => setEntryMode('per100g')}>
            每 100g
          </button>
          <button type="button" className={entryMode === 'perUnit' ? 'active' : ''} onClick={() => setEntryMode('perUnit')}>
            每份 / 罐
          </button>
          <button type="button" className={entryMode === 'none' ? 'active' : ''} onClick={() => setEntryMode('none')}>
            暂无数据
          </button>
        </div>
      </div>

      {entryMode === 'perKg' && (
        <label className="field">
          <span className="field-label">热量 (kcal / kg)</span>
          <input
            type="number"
            inputMode="decimal"
            value={kcalPerKg}
            onChange={(e) => setKcalPerKg(e.target.value)}
            placeholder="例如 3710"
          />
        </label>
      )}

      {entryMode === 'per100g' && (
        <label className="field">
          <span className="field-label">热量 (kcal / 100g)</span>
          <input
            type="number"
            inputMode="decimal"
            value={kcalPer100g}
            onChange={(e) => setKcalPer100g(e.target.value)}
            placeholder="例如 371"
          />
        </label>
      )}

      {entryMode === 'perUnit' && (
        <>
          <label className="field">
            <span className="field-label">每份热量 (kcal)</span>
            <input
              type="number"
              inputMode="decimal"
              value={kcalPerUnit}
              onChange={(e) => setKcalPerUnit(e.target.value)}
              placeholder="例如 80"
            />
          </label>
          <label className="field">
            <span className="field-label">单位名称</span>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="例如 罐 / 块 / 包"
            />
          </label>
          <label className="field">
            <span className="field-label">每份重量 (g，可选)</span>
            <input
              type="number"
              inputMode="decimal"
              value={gramPerUnit}
              onChange={(e) => setGramPerUnit(e.target.value)}
              placeholder="例如 70"
            />
          </label>
        </>
      )}

      <label className="field">
        <span className="field-label">备注</span>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="可选" />
      </label>

      <div className="form-actions">
        <button className="secondary-btn" onClick={onCancel}>
          取消
        </button>
        <button className="primary-btn" disabled={!canSave} onClick={() => onSave(buildFood())}>
          保存
        </button>
      </div>
    </Card>
  )
}
