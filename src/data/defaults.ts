import type { Food, Settings, WeightLog } from '../types'
import { genId } from '../utils/id'
import { todayStr } from '../utils/date'

export function defaultFoods(): Food[] {
  return [
    {
      id: 'orijen-indoor',
      name: 'Orijen猫粮',
      brand: 'Orijen',
      category: 'dry',
      kcalPerGram: 3.71,
      defaultGrams: 15,
      notes: '3710 kcal/kg',
      createdAt: Date.now(),
    },
    {
      id: 'weishi-freeze-dried',
      name: '卫仕冻干',
      brand: '卫仕',
      category: 'freeze-dried',
      kcalPerGram: 4.04,
      defaultGrams: 7.5,
      notes: '404 kcal/100g',
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
