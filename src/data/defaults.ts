import type { Food, Settings, WeightLog } from '../types'
import { genId } from '../utils/id'
import { todayStr } from '../utils/date'

export function defaultFoods(): Food[] {
  return [
    {
      id: 'orijen-indoor',
      name: 'Orijen 室内伴侣猫粮',
      brand: 'Orijen',
      category: 'dry',
      kcalPerGram: 3.71,
      notes: '3710 kcal/kg',
      createdAt: Date.now(),
    },
  ]
}

export const defaultSettings: Settings = {
  catName: '布尼',
  currentWeight: 6.3,
  targetWeight: 5.75,
  dailyCalorieTarget: 240,
  safeRangeMin: 230,
  safeRangeMax: 260,
}

export function defaultWeightLogs(): WeightLog[] {
  return [
    {
      id: genId(),
      date: todayStr(),
      weightKg: 6.3,
      note: '初始体重',
      createdAt: Date.now(),
    },
  ]
}
