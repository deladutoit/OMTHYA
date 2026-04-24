import { useState, Suspense, lazy } from 'react'
import { LanguageScreen } from './components/LanguageScreen'
import { WelcomeScreen } from './components/WelcomeScreen'
import { MenuScreen } from './components/MenuScreen'
import { SubjectScreen } from './components/SubjectScreen'
import { EndScreen } from './components/EndScreen'
import { GameRouter } from './games/GameRouter'
import { saveSession, clearSession, logCompletedSession, getTokens, addToken, spendToken } from './lib/session'
import type { Screen, Language, AgeGroup, Subject } from './types'

// Lazy-load Phaser so the ~1.4 MB engine only downloads when the soccer game is opened
const SoccerGame = lazy(() =>
  import('./games/SoccerGame').then((m) => ({ default: m.SoccerGame })),
)

export default function App() {
  const [screen, setScreen] = useState<Screen>('language')
  const [language, setLanguage] = useState<Language>('english')
  const [userName, setUserName] = useState('')
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('primary')
  const [subject, setSubject] = useState<Subject>('english')
  const [tokens, setTokens] = useState(() => getTokens())

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
    addToken()
    setTokens(getTokens())
    setScreen('end')
  }

  function handleOfflineSelect() {
    if (spendToken()) {
      setTokens(getTokens())
      setScreen('offline')
    }
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
          tokens={tokens}
          onAgeGroupSelect={handleAgeGroupSelect}
          onOfflineSelect={handleOfflineSelect}
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
      return (
        <EndScreen
          userName={userName}
          language={language}
          tokensEarned={1}
          onContinue={() => setScreen('menu')}
          onRestart={handleRestart}
        />
      )

    case 'offline':
      return (
        <Suspense fallback={
          <div className="min-h-screen bg-green-800 flex items-center justify-center">
            <p className="text-white text-2xl font-bold animate-pulse">Loading game…</p>
          </div>
        }>
          <SoccerGame language={language} onBack={() => setScreen('menu')} />
        </Suspense>
      )

    // loading screen no longer needed — games are instant
    default:
      return <LanguageScreen onSelect={handleLanguageSelect} />
  }
}
