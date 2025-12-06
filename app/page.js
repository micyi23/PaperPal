'use client'

import { AppProvider } from '../src/context/AppContext'
import Dashboard from '../src/components/Dashboard'

export default function Home() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}

