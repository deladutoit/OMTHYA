import { MemoryFlip } from './MemoryFlip'
import { WordScramble } from './WordScramble'
import { Hangman } from './Hangman'
import { QuickTap } from './QuickTap'
import { TrueOrFalse } from './TrueOrFalse'
import type { Subject, AgeGroup, Language } from '../types'

interface Props {
  subject: Subject
  ageGroup: AgeGroup
  language: Language
  onComplete: (score: number) => void
  onBack: () => void
}

export function GameRouter({ subject, ageGroup, language, onComplete, onBack }: Props) {
  // Early learners always get Memory Flip — simpler, no reading required
  if (ageGroup === 'early-learners') {
    return (
      <MemoryFlip
        subject={subject}
        ageGroup={ageGroup}
        language={language}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }

  // Primary + Teen routing by subject
  if (subject === 'english') {
    if (ageGroup === 'teen') {
      return <Hangman language={language} onComplete={onComplete} onBack={onBack} />
    }
    return (
      <WordScramble
        ageGroup={ageGroup}
        language={language}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }

  if (subject === 'math') {
    return (
      <QuickTap
        ageGroup={ageGroup}
        language={language}
        onComplete={onComplete}
        onBack={onBack}
      />
    )
  }

  // general-knowledge
  return (
    <TrueOrFalse
      ageGroup={ageGroup}
      language={language}
      onComplete={onComplete}
      onBack={onBack}
    />
  )
}
