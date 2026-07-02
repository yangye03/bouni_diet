import { useData } from '../store/DataContext'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { todayStr } from '../utils/date'
import { formatGrams, formatKcal } from '../utils/calories'

export function Today() {
  const { settings, foodLogs, weightLogs, deleteFoodLog } = useData()

  const today = todayStr()
  const todayLogs = foodLogs.filter((l) => l.date === today)
  const eaten = todayLogs.reduce((sum, l) => sum + l.kcal, 0)
  const target = settings.dailyCalorieTarget
  const remaining = target - eaten

  const latestWeightLog = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date)).pop()
  const latestWeight = latestWeightLog?.weightKg ?? settings.currentWeight

  let statusMsg = ''
  let statusType: 'ok' | 'full' | 'over' = 'ok'
  if (remaining > 0) {
    statusMsg = `今天还可以吃 ${formatKcal(remaining)} kcal`
    statusType = 'ok'
  } else if (remaining === 0) {
    statusMsg = '今天刚好吃满目标'
    statusType = 'full'
  } else {
    statusMsg = `今天已超出 ${formatKcal(-remaining)} kcal，建议减少零食`
    statusType = 'over'
  }

  const { safeRangeMin, safeRangeMax } = settings
  const inSafeRange = eaten >= safeRangeMin && eaten <= safeRangeMax
  const overSafe = eaten > safeRangeMax

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <img className="cat-avatar" src={`${import.meta.env.BASE_URL}buni.jpg`} alt={settings.catName} />
          <div>
            <h1 className="page-title">{settings.catName}的饮食</h1>
            <p className="page-subtitle">今日</p>
          </div>
        </div>
      </header>

      <Card className="weight-summary">
        <div className="stat-row">
          <div className="stat">
            <div className="stat-label">当前体重</div>
            <div className="stat-value">
              {latestWeight.toFixed(2)}
              <span className="unit">kg</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">目标体重</div>
            <div className="stat-value">
              {settings.targetWeight.toFixed(2)}
              <span className="unit">kg</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">还需减</div>
            <div className="stat-value">
              {Math.max(0, latestWeight - settings.targetWeight).toFixed(2)}
              <span className="unit">kg</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="calorie-card">
        <div className="calorie-header">
          <span className="calorie-label">今日热量</span>
          <span className="calorie-target">目标 {target} kcal</span>
        </div>
        <div className="calorie-big">
          <span className="calorie-eaten">{formatKcal(eaten)}</span>
          <span className="calorie-divider">/</span>
          <span className="calorie-total">{target}</span>
          <span className="calorie-unit">kcal</span>
        </div>
        <ProgressBar value={eaten} max={target} tone={overSafe ? 'over' : 'normal'} />
        <div className={`status-msg ${statusType}`}>{statusMsg}</div>
        {inSafeRange && remaining !== 0 && (
          <div className="safe-hint">已进入安全摄入范围（{safeRangeMin}–{safeRangeMax} kcal）</div>
        )}
      </Card>

      <details className="calc-explain">
        <summary>卡路里是怎么算的？</summary>
        <div className="explain-body">
          <p>
            <strong>今日摄入</strong> = 各条进食记录的热量之和。
          </p>
          <p>
            <strong>单条记录热量</strong> = 克数 × 食物热量密度（kcal/g）。
          </p>
          <p className="explain-example">
            例如 Orijen猫粮：3710 kcal/kg ÷ 1000 = <strong>3.71 kcal/g</strong>，
            喂 65 g 即 65 × 3.71 ≈ <strong>241 kcal</strong>。
          </p>
          <p>
            <strong>剩余可吃克数</strong> = 剩余热量 ÷ 食物热量密度。
            例如剩余 120 kcal：120 ÷ 3.71 ≈ 32.3 g。
          </p>
          <p className="muted">每日目标（{settings.dailyCalorieTarget} kcal）与安全范围（{settings.safeRangeMin}–{settings.safeRangeMax} kcal）为手动设置，可在「设置」中调整。</p>
        </div>
      </details>

      <div className="section-header">
        <h2>今日进食记录</h2>
      </div>
      {todayLogs.length === 0 ? (
        <Card className="empty">今天还没有记录，点击「记录」添加</Card>
      ) : (
        <div className="log-list">
          {todayLogs.map((l) => (
            <Card key={l.id} className="log-item">
              <div className="log-main">
                <div className="log-name">{l.foodName}</div>
                <div className="log-meta">
                  {l.grams > 0 ? `${formatGrams(l.grams)} g · ` : ''}
                  {formatKcal(l.kcal)} kcal
                </div>
                {l.note && <div className="log-note">{l.note}</div>}
              </div>
              <button className="log-delete" onClick={() => deleteFoodLog(l.id)}>
                删除
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
