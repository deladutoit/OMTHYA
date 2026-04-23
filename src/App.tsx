import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Status = 'checking' | 'connected' | 'error'

export default function App() {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    supabase
      .from('names')
      .select('count', { count: 'exact', head: true })
      .then(({ error }) => setStatus(error ? 'error' : 'connected'))
  }, [])

  const dot =
    status === 'connected'
      ? 'bg-green-500'
      : status === 'error'
      ? 'bg-red-500'
      : 'bg-yellow-400 animate-pulse'

  const label =
    status === 'checking'
      ? 'Checking Supabase…'
      : status === 'connected'
      ? 'Supabase connected'
      : 'Supabase error — check console'

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        Education Station
      </h1>
      <p className="text-gray-400 text-lg">Base app — stack check</p>

      <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-6 py-4 shadow-lg">
        <span className={`w-3 h-3 rounded-full ${dot}`} />
        <span className="text-white">{label}</span>
      </div>

      <p className="text-gray-600 text-sm">
        React · TypeScript · Vite · Tailwind · Supabase
      </p>
    </div>
  )
}
