import type { AppData } from '../types'
import { defaultFoods, defaultSettings, defaultWeightLogs } from '../data/defaults'

const STORAGE_KEY = 'buni-diet-data-v1'

function freshData(): AppData {
  return {
    foods: defaultFoods(),
    foodLogs: [],
    weightLogs: defaultWeightLogs(),
    settings: { ...defaultSettings },
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = freshData()
      saveData(initial)
      return initial
    }
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      foods: parsed.foods ?? defaultFoods(),
      foodLogs: parsed.foodLogs ?? [],
      weightLogs: parsed.weightLogs ?? defaultWeightLogs(),
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    }
  } catch (e) {
    console.error('Failed to load data, resetting to defaults.', e)
    return freshData()
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data.', e)
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY)
}
