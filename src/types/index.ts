export type Language = 'oshiwambo' | 'khoekhoegowab' | 'afrikaans' | 'english'
export type AgeGroup = 'early-learners' | 'primary' | 'teen'
export type Subject = 'english' | 'math' | 'general-knowledge'
export type Screen = 'language' | 'welcome' | 'menu' | 'subject' | 'quiz' | 'end' | 'offline'

export interface Question {
  question: string
  options: string[]
  answer: string
}

export interface Lesson {
  lesson_title: string
  questions: Question[]
}

export interface SessionData {
  name: string
  language: Language
  ageGroup?: AgeGroup
  subject?: Subject
  score?: number
  timestamp: string
  completed: boolean
}
