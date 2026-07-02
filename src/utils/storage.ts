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
    const existingFoods = parsed.foods ?? []
    const defaults = defaultFoods()
    const existingIds = new Set(existingFoods.map((f) => f.id))
    const merged = [...existingFoods]
    for (const d of defaults) {
      if (existingIds.has(d.id)) {
        const idx = merged.findIndex((f) => f.id === d.id)
        merged[idx] = { ...d, ...merged[idx] }
      } else {
        merged.push(d)
      }
    }
    // one-time rename: Orijen 室内伴侣猫粮 → Orijen猫粮
    const OLD_ORIJEN_NAME = 'Orijen 室内伴侣猫粮'
    const NEW_ORIJEN_NAME = 'Orijen猫粮'
    for (const f of merged) {
      if (f.id === 'orijen-indoor' && f.name === OLD_ORIJEN_NAME) {
        f.name = NEW_ORIJEN_NAME
      }
    }
    const foodLogs = (parsed.foodLogs ?? []).map((l) =>
      l.foodName === OLD_ORIJEN_NAME ? { ...l, foodName: NEW_ORIJEN_NAME } : l,
    )
    return {
      foods: merged,
      foodLogs,
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
