import { Baby, Users, GraduationCap, Gamepad2, WifiOff } from 'lucide-react'
import { t } from '../lib/translations'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { AgeGroup, Language } from '../types'

interface Props {
  userName: string
  language: Language
  onAgeGroupSelect: (ag: AgeGroup) => void
  onOfflineSelect: () => void
}

export function MenuScreen({ userName, language, onAgeGroupSelect, onOfflineSelect }: Props) {
  const isOnline = useOnlineStatus()

  const ageGroups: { id: AgeGroup; label: string; ages: string; icon: typeof Baby; bg: string }[] = [
    { id: 'early-learners', label: t(language, 'earlyLearners'), ages: t(language, 'earlyLearnersAges'), icon: Baby,          bg: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'primary',        label: t(language, 'primary'),       ages: t(language, 'primaryAges'),       icon: Users,         bg: 'bg-emerald-500 hover:bg-emerald-600' },
    { id: 'teen',           label: t(language, 'teen'),          ages: t(language, 'teenAges'),          icon: GraduationCap, bg: 'bg-purple-500 hover:bg-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            {t(language, 'greeting', { name: userName })}
          </h1>
          <p className="text-2xl text-gray-500">{t(language, 'chooseAdventure')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ageGroups.map(({ id, label, ages, icon: Icon, bg }) => {
            const disabled = !isOnline
            return (
              <button
                key={id}
                onClick={() => !disabled && onAgeGroupSelect(id)}
                disabled={disabled}
                className={`${disabled ? 'bg-gray-300 cursor-not-allowed' : bg} text-white p-8 rounded-3xl shadow-xl transition-transform ${disabled ? '' : 'hover:scale-105 active:scale-95'}`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon size={44} />
                  </div>
                  <p className="text-3xl font-bold">{label}</p>
                  <p className="text-xl opacity-90">{ages}</p>
                  {disabled && (
                    <span className="flex items-center gap-2 text-sm opacity-70 mt-1">
                      <WifiOff size={16} /> {t(language, 'requiresInternet')}
                    </span>
                  )}
                </div>
              </button>
            )
          })}

          {/* Offline games — always available */}
          <button
            onClick={onOfflineSelect}
            className="bg-orange-500 hover:bg-orange-600 text-white p-8 rounded-3xl shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Gamepad2 size={44} />
              </div>
              <p className="text-3xl font-bold">{t(language, 'offlineGames')}</p>
              <p className="text-xl opacity-90">{t(language, 'offlineDesc')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
