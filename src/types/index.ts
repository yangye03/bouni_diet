export type FoodCategory = 'dry' | 'wet' | 'treat' | 'freeze-dried' | 'other'

export interface Food {
  id: string
  name: string
  brand?: string
  category: FoodCategory
  /** Normalized kilocalories per gram. Present when derivable from kcal/kg, kcal/100g, or per-unit + gram-per-unit. */
  kcalPerGram?: number
  /** Kilocalories per unit (can / piece / pack). Used for foods logged by count rather than weight. */
  kcalPerUnit?: number
  /** Label for a unit, e.g. "罐" / "块" / "包". */
  unitName?: string
  /** Grams per unit. Lets per-unit foods also compute kcalPerGram. */
  gramPerUnit?: number
  notes?: string
  /** True when calorie data is not yet known ("数据待补充"). */
  needsData?: boolean
  createdAt: number
}

export interface FoodLog {
  id: string
  /** YYYY-MM-DD, local time. */
  date: string
  foodId: string
  foodName: string
  grams: number
  kcal: number
  note?: string
  createdAt: number
}

export interface WeightLog {
  id: string
  /** YYYY-MM-DD, local time. */
  date: string
  weightKg: number
  note?: string
  createdAt: number
}

export interface Settings {
  catName: string
  /** Baseline / starting current weight (kg). Used as the "rising" warning threshold. */
  currentWeight: number
  targetWeight: number
  dailyCalorieTarget: number
  safeRangeMin: number
  safeRangeMax: number
}

export interface AppData {
  foods: Food[]
  foodLogs: FoodLog[]
  weightLogs: WeightLog[]
  settings: Settings
}
