import { useState } from 'react'
import { DataProvider } from './store/DataContext'
import { BottomNav } from './components/BottomNav'
import { Today } from './pages/Today'
import { AddLog } from './pages/AddLog'
import { FoodLibrary } from './pages/FoodLibrary'
import { Weight } from './pages/Weight'
import { SettingsPage } from './pages/Settings'

type Tab = 'today' | 'log' | 'food' | 'weight' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>('today')
  return (
    <DataProvider>
      <div className="app-shell">
        <main className="app-main">
          {tab === 'today' && <Today />}
          {tab === 'log' && <AddLog />}
          {tab === 'food' && <FoodLibrary />}
          {tab === 'weight' && <Weight />}
          {tab === 'settings' && <SettingsPage />}
        </main>
        <BottomNav current={tab} onChange={(t) => setTab(t as Tab)} />
      </div>
    </DataProvider>
  )
}
