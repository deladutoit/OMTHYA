import { createClient } from '@supabase/supabase-js'
import type { AgeGroup, Subject, Language, Lesson } from '../types'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export async function saveUserName(name: string): Promise<void> {
  const { error } = await supabase.from('names').insert([{ name }])
  if (error) console.error('Supabase insert error:', error.message)
}

export async function fetchLesson(
  ageGroup: AgeGroup,
  subject: Subject,
  language: Language,
): Promise<Lesson> {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ageGroup, subject, language }),
    },
  )

  if (!res.ok) throw new Error(`Lesson fetch failed: ${res.status} ${res.statusText}`)

  const lesson: Lesson = await res.json()
  if (!lesson.lesson_title || !Array.isArray(lesson.questions)) {
    throw new Error('Invalid lesson structure returned from edge function')
  }
  return lesson
}
