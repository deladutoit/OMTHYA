import type { SessionData, Language, AgeGroup, Subject } from '../types'

const CURRENT_KEY = 'es_current_session'
const LOG_KEY = 'es_sessions_log'

export function saveSession(data: Partial<SessionData>) {
  const current = getSession()
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ ...current, ...data }))
}

export function getSession(): Partial<SessionData> {
  const raw = localStorage.getItem(CURRENT_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function clearSession() {
  localStorage.removeItem(CURRENT_KEY)
}

export function logCompletedSession(score: number) {
  const session = getSession()
  if (!session.name || !session.language) return

  const completed: SessionData = {
    name: session.name,
    language: session.language as Language,
    ageGroup: session.ageGroup as AgeGroup | undefined,
    subject: session.subject as Subject | undefined,
    score,
    timestamp: session.timestamp ?? new Date().toISOString(),
    completed: true,
  }

  const raw = localStorage.getItem(LOG_KEY)
  const log: SessionData[] = raw ? JSON.parse(raw) : []
  log.push(completed)
  localStorage.setItem(LOG_KEY, JSON.stringify(log))
}

export function getSessionLog(): SessionData[] {
  const raw = localStorage.getItem(LOG_KEY)
  return raw ? JSON.parse(raw) : []
}

// ─── Soccer tokens ───────────────────────────────────────────────────────────
const TOKENS_KEY = 'es_soccer_tokens'

export function getTokens(): number {
  return parseInt(localStorage.getItem(TOKENS_KEY) ?? '0', 10)
}

export function addToken(): void {
  localStorage.setItem(TOKENS_KEY, String(getTokens() + 1))
}

export function spendToken(): boolean {
  const current = getTokens()
  if (current <= 0) return false
  localStorage.setItem(TOKENS_KEY, String(current - 1))
  return true
}
