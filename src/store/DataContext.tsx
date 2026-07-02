import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppData, Food, FoodLog, Settings, WeightLog } from '../types'
import { clearData, loadData, saveData } from '../utils/storage'
import { genId } from '../utils/id'

interface DataContextValue extends AppData {
  addFoodLog: (log: Omit<FoodLog, 'id' | 'createdAt'>) => void
  deleteFoodLog: (id: string) => void
  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => string
  updateFood: (id: string, patch: Partial<Food>) => void
  deleteFood: (id: string) => void
  addWeightLog: (log: Omit<WeightLog, 'id' | 'createdAt'>) => void
  deleteWeightLog: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetAll: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const value: DataContextValue = {
    ...data,
    addFoodLog: (log) =>
      setData((prev) => ({
        ...prev,
        foodLogs: [...prev.foodLogs, { ...log, id: genId(), createdAt: Date.now() }],
      })),
    deleteFoodLog: (id) =>
      setData((prev) => ({ ...prev, foodLogs: prev.foodLogs.filter((l) => l.id !== id) })),
    addFood: (food) => {
      const id = genId()
      setData((prev) => ({
        ...prev,
        foods: [...prev.foods, { ...food, id, createdAt: Date.now() }],
      }))
      return id
    },
    updateFood: (id, patch) =>
      setData((prev) => ({
        ...prev,
        foods: prev.foods.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      })),
    deleteFood: (id) =>
      setData((prev) => ({ ...prev, foods: prev.foods.filter((f) => f.id !== id) })),
    addWeightLog: (log) =>
      setData((prev) => ({
        ...prev,
        weightLogs: [...prev.weightLogs, { ...log, id: genId(), createdAt: Date.now() }],
      })),
    deleteWeightLog: (id) =>
      setData((prev) => ({
        ...prev,
        weightLogs: prev.weightLogs.filter((l) => l.id !== id),
      })),
    updateSettings: (patch) =>
      setData((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
    resetAll: () => {
      clearData()
      setData(loadData())
    },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
