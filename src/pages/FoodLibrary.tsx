import { useState } from 'react'
import { useData } from '../store/DataContext'
import { Card } from '../components/Card'
import { FoodForm } from '../components/FoodForm'
import { categoryLabels } from '../constants'
import { foodCanCalculate } from '../utils/calories'
import type { Food } from '../types'

export function FoodLibrary() {
  const { foods, addFood, updateFood, deleteFood } = useData()
  const [editing, setEditing] = useState<Food | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">食物库</h1>
        <button
          className="header-btn"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
        >
          + 添加
        </button>
      </header>

      {showForm && (
        <FoodForm
          initial={editing}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={(data) => {
            if (editing) updateFood(editing.id, data)
            else addFood(data)
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      <div className="food-list">
        {foods.map((f) => (
          <Card key={f.id} className="food-item">
            <div className="food-info">
              <div className="food-name">
                {f.name}
                {f.needsData && <span className="badge">数据待补充</span>}
              </div>
              <div className="food-meta">
                {f.brand && <span>{f.brand} · </span>}
                {categoryLabels[f.category]}
              </div>
              <div className="food-cal">
                {foodCanCalculate(f) ? (
                  <>
                    {f.kcalPerGram != null && (
                      <span>{Math.round(f.kcalPerGram * 1000)} kcal/kg · {f.kcalPerGram.toFixed(2)} kcal/g</span>
                    )}
                    {f.kcalPerUnit != null && (
                      <span>
                        {f.kcalPerUnit} kcal/{f.unitName ?? '份'}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="muted">热量数据待补充</span>
                )}
              </div>
              {f.notes && <div className="food-notes">{f.notes}</div>}
            </div>
            <div className="food-actions">
              <button
                onClick={() => {
                  setEditing(f)
                  setShowForm(true)
                }}
              >
                编辑
              </button>
              <button
                className="danger"
                onClick={() => {
                  if (confirm(`删除「${f.name}」？`)) deleteFood(f.id)
                }}
              >
                删除
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
