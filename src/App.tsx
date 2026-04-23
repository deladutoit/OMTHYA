import { useState } from 'react'
import { LanguageScreen } from './components/LanguageScreen'
import { WelcomeScreen } from './components/WelcomeScreen'
import { MenuScreen } from './components/MenuScreen'
import { SubjectScreen } from './components/SubjectScreen'
import { EndScreen } from './components/EndScreen'
import { GameRouter } from './games/GameRouter'
import { saveSession, clearSession, logCompletedSession } from './lib/session'
import type { Screen, Language, AgeGroup, Subject } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('language')
  const [language, setLanguage] = useState<Language>('english')
  const [userName, setUserName] = useState('')
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('primary')
  const [subject, setSubject] = useState<Subject>('english')

  function handleLanguageSelect(lang: Language) {
    setLanguage(lang)
    saveSession({ language: lang })
    setScreen('welcome')
  }

  function handleWelcomeComplete(name: string) {
    setUserName(name)
    saveSession({ name, timestamp: new Date().toISOString() })
    setScreen('menu')
  }

  function handleAgeGroupSelect(ag: AgeGroup) {
    setAgeGroup(ag)
    saveSession({ ageGroup: ag })
    setScreen('subject')
  }

  function handleSubjectSelect(subj: Subject) {
    setSubject(subj)
    saveSession({ subject: subj })
    setScreen('quiz')
  }

  function handleGameComplete(score: number) {
    logCompletedSession(score)
    setScreen('end')
  }

  function handleRestart() {
    clearSession()
    setLanguage('english')
    setUserName('')
    setScreen('language')
  }

  switch (screen) {
    case 'language':
      return <LanguageScreen onSelect={handleLanguageSelect} />

    case 'welcome':
      return <WelcomeScreen language={language} onComplete={handleWelcomeComplete} />

    case 'menu':
      return (
        <MenuScreen
          userName={userName}
          language={language}
          onAgeGroupSelect={handleAgeGroupSelect}
          onOfflineSelect={() => setScreen('offline')}
        />
      )

    case 'subject':
      return (
        <SubjectScreen
          ageGroup={ageGroup}
          language={language}
          onSubjectSelect={handleSubjectSelect}
          onBack={() => setScreen('menu')}
        />
      )

    case 'quiz':
      return (
        <GameRouter
          subject={subject}
          ageGroup={ageGroup}
          language={language}
          onComplete={handleGameComplete}
          onBack={() => setScreen('subject')}
        />
      )

    case 'end':
      return <EndScreen userName={userName} language={language} onRestart={handleRestart} />

    case 'offline':
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center gap-8 p-8">
          <span className="text-8xl">🎮</span>
          <h1 className="text-4xl font-bold text-gray-800">Games & Activities</h1>
          <p className="text-xl text-gray-500 text-center max-w-md">
            Offline games will launch here. In kiosk mode this triggers an external application via shell script.
          </p>
          <button
            onClick={() => setScreen('menu')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-semibold px-10 py-4 rounded-2xl transition-colors"
          >
            Back to Menu
          </button>
        </div>
      )

    // loading screen no longer needed — games are instant
    default:
      return <LanguageScreen onSelect={handleLanguageSelect} />
  }
}
