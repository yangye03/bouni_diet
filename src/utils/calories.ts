import type { Food } from '../types'

/** Convert kcal/kg to kcal/g. */
export function kcalPerKgToPerGram(kcalPerKg: number): number {
  return kcalPerKg / 1000
}

/** Convert kcal/100g to kcal/g. */
export function kcalPer100gToPerGram(kcalPer100g: number): number {
  return kcalPer100g / 100
}

export interface CalcInput {
  grams?: number
  units?: number
}

/** Compute total kcal for a log entry from a food and the amount eaten. */
export function calcLogKcal(food: Food, input: CalcInput): number {
  let kcal = 0
  if (input.grams && input.grams > 0 && food.kcalPerGram != null) {
    kcal += input.grams * food.kcalPerGram
  }
  if (input.units && input.units > 0 && food.kcalPerUnit != null) {
    kcal += input.units * food.kcalPerUnit
  }
  return kcal
}

/** A food can be used in a log only if at least one calorie basis is known. */
export function foodCanCalculate(food: Food): boolean {
  return food.kcalPerGram != null || food.kcalPerUnit != null
}

/** How many grams of a food can still be eaten given remaining kcal. */
export function remainingGrams(remainingKcal: number, kcalPerGram: number): number {
  if (kcalPerGram <= 0) return 0
  return remainingKcal / kcalPerGram
}

export function formatKcal(n: number): string {
  return Math.round(n).toString()
}

export function formatGrams(n: number): string {
  return n.toFixed(1)
}
