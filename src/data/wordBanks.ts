import type { Subject, AgeGroup, Language } from '../types'

export interface Pair {
  a: string
  b: string
}

// ---------------------------------------------------------------------------
// MATH
// Content is language-independent — numerals and symbols are universal.
// UI labels come from translations.ts; the card content below is the same
// for all languages.
// ---------------------------------------------------------------------------

const MATH_EARLY: Pair[] = [
  { a: '1', b: '⚀' },
  { a: '2', b: '⚁' },
  { a: '3', b: '⚂' },
  { a: '4', b: '⚃' },
  { a: '5', b: '⚄' },
  { a: '6', b: '⚅' },
  { a: '7', b: '🌟🌟🌟🌟🌟🌟🌟' },
  { a: '8', b: '🌟🌟🌟🌟🌟🌟🌟🌟' },
]

const MATH_PRIMARY: Pair[] = [
  { a: '3 × 4', b: '12' },
  { a: '6 × 7', b: '42' },
  { a: '8 × 9', b: '72' },
  { a: '5 × 5', b: '25' },
  { a: '7 × 6', b: '42' },
  { a: '4 × 8', b: '32' },
  { a: '½',     b: '0.5' },
  { a: '¼',     b: '0.25' },
]

const MATH_TEEN: Pair[] = [
  { a: 'π (pi)',        b: '≈ 3.14159' },
  { a: 'Hypotenuse',   b: 'Longest side of a right triangle' },
  { a: 'Perimeter',    b: 'Distance around a shape' },
  { a: 'Area',         b: 'Space inside a shape' },
  { a: 'Prime number', b: 'Divisible only by 1 and itself' },
  { a: 'Denominator',  b: 'Bottom number of a fraction' },
  { a: 'Numerator',    b: 'Top number of a fraction' },
  { a: '2³',           b: '8' },
]

// ---------------------------------------------------------------------------
// ENGLISH (subject)
// Always shown in English — the goal IS to learn English words.
// Early: emoji ↔ word  |  Primary: word ↔ definition  |  Teen: term ↔ meaning
// ---------------------------------------------------------------------------

const ENGLISH_EARLY: Pair[] = [
  { a: '🐱', b: 'Cat' },
  { a: '🐶', b: 'Dog' },
  { a: '🏠', b: 'House' },
  { a: '🌳', b: 'Tree' },
  { a: '📚', b: 'Book' },
  { a: '☀️', b: 'Sun' },
  { a: '🌧️', b: 'Rain' },
  { a: '🍎', b: 'Apple' },
]

const ENGLISH_PRIMARY: Pair[] = [
  { a: 'Noun',      b: 'A person, place or thing' },
  { a: 'Verb',      b: 'An action word' },
  { a: 'Adjective', b: 'A word that describes a noun' },
  { a: 'Adverb',    b: 'A word that describes a verb' },
  { a: 'Synonym',   b: 'A word with a similar meaning' },
  { a: 'Antonym',   b: 'A word with the opposite meaning' },
  { a: 'Vowel',     b: 'A, E, I, O, U' },
  { a: 'Consonant', b: 'Any letter that is not a vowel' },
]

const ENGLISH_TEEN: Pair[] = [
  { a: 'Metaphor',    b: 'Describing one thing as another' },
  { a: 'Simile',      b: 'Comparing using "like" or "as"' },
  { a: 'Alliteration', b: 'Repeated first sounds in words' },
  { a: 'Protagonist', b: 'The main character in a story' },
  { a: 'Antagonist',  b: 'The character opposing the hero' },
  { a: 'Narrative',   b: 'A spoken or written account' },
  { a: 'Inference',   b: 'Conclusion drawn from evidence' },
  { a: 'Irony',       b: 'Saying the opposite of what is meant' },
]

// ---------------------------------------------------------------------------
// GENERAL KNOWLEDGE
// Namibia-focused facts for all languages — translating place names is not
// needed since they are proper nouns.
// ---------------------------------------------------------------------------

const GK_EARLY: Pair[] = [
  { a: '🦁', b: 'Lion' },
  { a: '🐘', b: 'Elephant' },
  { a: '🦒', b: 'Giraffe' },
  { a: '🦓', b: 'Zebra' },
  { a: '🐊', b: 'Crocodile' },
  { a: '🦅', b: 'Eagle' },
  { a: '🌵', b: 'Cactus' },
  { a: '🏜️', b: 'Desert' },
]

const GK_PRIMARY: Pair[] = [
  { a: 'Namibia',      b: 'Windhoek' },
  { a: 'South Africa', b: 'Pretoria' },
  { a: 'Botswana',     b: 'Gaborone' },
  { a: 'Zimbabwe',     b: 'Harare' },
  { a: 'Namib Desert', b: 'Oldest desert in the world' },
  { a: 'Etosha',       b: "Namibia's largest national park" },
  { a: 'Orange River', b: 'Southern border of Namibia' },
  { a: '21 March 1990', b: 'Namibia independence day' },
]

const GK_TEEN: Pair[] = [
  { a: 'Sam Nujoma',     b: 'First President of Namibia' },
  { a: 'SWAPO',          b: 'Ruling party since independence' },
  { a: 'Walvis Bay',     b: "Namibia's main harbour city" },
  { a: 'Himba',          b: 'Indigenous people of NW Namibia' },
  { a: 'Skeleton Coast', b: 'Dangerous NW Namibian coastline' },
  { a: 'Tsau ǁKhaeb',   b: 'Former name: Sperrgebiet park' },
  { a: 'Photosynthesis', b: 'How plants make food from sunlight' },
  { a: 'Ecosystem',      b: 'Community of interacting organisms' },
]

// ---------------------------------------------------------------------------
// Language-specific overrides
// For vocabulary games where the UI language affects the card content itself.
// Primarily useful for Early Learners English — showing the word in the
// learner's home language alongside the English word they're learning.
// ---------------------------------------------------------------------------

const ENGLISH_EARLY_AFRIKAANS: Pair[] = [
  { a: '🐱  Cat', b: 'Kat' },
  { a: '🐶  Dog', b: 'Hond' },
  { a: '🏠  House', b: 'Huis' },
  { a: '🌳  Tree', b: 'Boom' },
  { a: '📚  Book', b: 'Boek' },
  { a: '☀️  Sun', b: 'Son' },
  { a: '🌧️  Rain', b: 'Reën' },
  { a: '🍎  Apple', b: 'Appel' },
]

// Oshiwambo vocabulary — reviewed for common words.
// Professional linguistic review recommended before full production use.
const ENGLISH_EARLY_OSHIWAMBO: Pair[] = [
  { a: '🐱  Cat', b: 'Ombishi' },
  { a: '🐶  Dog', b: 'Ombwa' },
  { a: '🏠  House', b: 'Onganda' },
  { a: '🌳  Tree', b: 'Omuti' },
  { a: '📚  Book', b: 'Omukanda' },
  { a: '☀️  Sun', b: 'Omutenya' },
  { a: '💧  Water', b: 'Omeya' },
  { a: '🍎  Apple', b: 'Omapulu' },
]

// ---------------------------------------------------------------------------
// WORD SCRAMBLE — English Primary + Teen
// hint: shown above the scramble area to give context
// ---------------------------------------------------------------------------

export interface ScrambleWord {
  word: string
  hint: string
}

const SCRAMBLE_PRIMARY: ScrambleWord[] = [
  { word: 'NOUN',       hint: 'A person, place or thing' },
  { word: 'VERB',       hint: 'An action word' },
  { word: 'VOWEL',      hint: 'A, E, I, O, U' },
  { word: 'STORY',      hint: 'A written or spoken account of events' },
  { word: 'COMMA',      hint: 'Punctuation mark that separates ideas' },
  { word: 'RHYME',      hint: 'Words that sound the same at the end' },
  { word: 'TITLE',      hint: 'The name of a book or story' },
  { word: 'DRAFT',      hint: 'A first version of a piece of writing' },
  { word: 'SPELL',      hint: 'To write the letters of a word correctly' },
  { word: 'PROSE',      hint: 'Ordinary written language, not poetry' },
]

const SCRAMBLE_TEEN: ScrambleWord[] = [
  { word: 'SIMILE',       hint: 'Comparison using "like" or "as"' },
  { word: 'IRONY',        hint: 'Saying the opposite of what is meant' },
  { word: 'THESIS',       hint: 'The main argument of an essay' },
  { word: 'SYNTAX',       hint: 'The arrangement of words in a sentence' },
  { word: 'DICTION',      hint: 'Word choice in writing or speech' },
  { word: 'CLIMAX',       hint: 'The turning point of a story' },
  { word: 'SYMBOL',       hint: 'An object that represents an idea' },
  { word: 'STANZA',       hint: 'A grouped set of lines in a poem' },
  { word: 'THEME',        hint: 'The central message of a story' },
  { word: 'OMNISCIENT',   hint: 'All-knowing narrator point of view' },
]

export function getScrambleWords(ageGroup: AgeGroup): ScrambleWord[] {
  return ageGroup === 'teen' ? SCRAMBLE_TEEN : SCRAMBLE_PRIMARY
}

// ---------------------------------------------------------------------------
// QUICK TAP — Math Primary + Teen
// 4 options always; answer must be one of the 4 options
// ---------------------------------------------------------------------------

export interface QuickTapQuestion {
  question: string
  options: string[]
  answer: string
}

const QUICKTAP_PRIMARY: QuickTapQuestion[] = [
  { question: '3 × 4 = ?',     options: ['10', '12', '14', '7'],   answer: '12' },
  { question: '6 × 7 = ?',     options: ['42', '48', '36', '13'],  answer: '42' },
  { question: '8 × 9 = ?',     options: ['63', '81', '72', '56'],  answer: '72' },
  { question: '5 × 5 = ?',     options: ['20', '30', '15', '25'],  answer: '25' },
  { question: '4 × 8 = ?',     options: ['28', '32', '36', '24'],  answer: '32' },
  { question: '9 × 9 = ?',     options: ['72', '81', '90', '63'],  answer: '81' },
  { question: '7 × 7 = ?',     options: ['42', '56', '49', '63'],  answer: '49' },
  { question: '½ of 20 = ?',   options: ['5', '10', '15', '8'],    answer: '10' },
  { question: '¼ of 40 = ?',   options: ['10', '8', '20', '4'],    answer: '10' },
  { question: '36 ÷ 6 = ?',    options: ['5', '4', '6', '7'],      answer: '6' },
  { question: '48 ÷ 8 = ?',    options: ['5', '7', '6', '4'],      answer: '6' },
  { question: '100 − 37 = ?',  options: ['63', '73', '67', '53'],  answer: '63' },
]

const QUICKTAP_TEEN: QuickTapQuestion[] = [
  { question: '2³ = ?',                    options: ['6', '8', '16', '4'],          answer: '8' },
  { question: '√144 = ?',                  options: ['11', '12', '14', '13'],       answer: '12' },
  { question: '15% of 200 = ?',            options: ['20', '25', '30', '15'],       answer: '30' },
  { question: 'Area of square, side=7?',   options: ['28', '14', '49', '42'],       answer: '49' },
  { question: '5² + 12² = ?',              options: ['169', '289', '144', '196'],   answer: '169' },
  { question: 'Perimeter of square, s=9?', options: ['36', '81', '27', '18'],       answer: '36' },
  { question: '0.25 × 80 = ?',             options: ['15', '25', '20', '40'],       answer: '20' },
  { question: '3/4 + 1/4 = ?',             options: ['4/8', '1', '3/8', '1½'],      answer: '1' },
  { question: 'π ≈ ?',                     options: ['3.41', '3.14', '2.14', '3.41'], answer: '3.14' },
  { question: '(-3) × (-4) = ?',           options: ['-12', '-7', '12', '7'],       answer: '12' },
  { question: '2/5 of 50 = ?',             options: ['10', '25', '20', '15'],       answer: '20' },
  { question: '7² = ?',                    options: ['14', '42', '49', '56'],       answer: '49' },
]

export function getQuickTapQuestions(ageGroup: AgeGroup): QuickTapQuestion[] {
  return ageGroup === 'teen' ? QUICKTAP_TEEN : QUICKTAP_PRIMARY
}

// ---------------------------------------------------------------------------
// TRUE OR FALSE — General Knowledge Primary + Teen
// ---------------------------------------------------------------------------

export interface TrueFalseStatement {
  statement: string
  isTrue: boolean
}

const TRUEFALSE_PRIMARY: TrueFalseStatement[] = [
  { statement: 'Windhoek is the capital city of Namibia.',          isTrue: true },
  { statement: 'Namibia gained independence on 21 March 1990.',     isTrue: true },
  { statement: 'The Namib Desert is the oldest desert on Earth.',   isTrue: true },
  { statement: 'Etosha is Namibia\'s largest national park.',       isTrue: true },
  { statement: 'The Orange River forms Namibia\'s northern border.',isTrue: false },
  { statement: 'Namibia is in East Africa.',                        isTrue: false },
  { statement: 'Sam Nujoma was Namibia\'s first president.',        isTrue: true },
  { statement: 'Gaborone is the capital of Zimbabwe.',              isTrue: false },
  { statement: 'South Africa\'s capital is Pretoria.',              isTrue: true },
  { statement: 'Namibia is the most densely populated country in Africa.', isTrue: false },
  { statement: 'The Zambezi River flows through northern Namibia.', isTrue: true },
  { statement: 'Walvis Bay is Namibia\'s main harbour city.',       isTrue: true },
]

const TRUEFALSE_TEEN: TrueFalseStatement[] = [
  { statement: 'SWAPO has been Namibia\'s ruling party since independence.', isTrue: true },
  { statement: 'The Skeleton Coast is on Namibia\'s eastern border.',        isTrue: false },
  { statement: 'Photosynthesis is how plants make food from sunlight.',      isTrue: true },
  { statement: 'The Himba people are indigenous to southern Namibia.',       isTrue: false },
  { statement: 'An ecosystem includes both living and non-living things.',   isTrue: true },
  { statement: 'Namibia has the world\'s largest cheetah population.',       isTrue: true },
  { statement: 'The Sperrgebiet was renamed Tsau ǁKhaeb National Park.',     isTrue: true },
  { statement: 'Namibia is the second largest country in Africa.',           isTrue: false },
  { statement: 'DNA contains the genetic instructions for living organisms.',isTrue: true },
  { statement: 'The human body has 206 bones.',                              isTrue: true },
  { statement: 'Sound travels faster than light.',                           isTrue: false },
  { statement: 'Namibia shares a border with Zambia in the Caprivi Strip.',  isTrue: true },
]

export function getTrueFalseStatements(ageGroup: AgeGroup): TrueFalseStatement[] {
  return ageGroup === 'teen' ? TRUEFALSE_TEEN : TRUEFALSE_PRIMARY
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getPairs(
  subject: Subject,
  ageGroup: AgeGroup,
  language: Language,
): Pair[] {
  // Language-specific overrides for vocabulary bridging
  if (subject === 'english' && ageGroup === 'early-learners') {
    if (language === 'afrikaans') return ENGLISH_EARLY_AFRIKAANS
    if (language === 'oshiwambo') return ENGLISH_EARLY_OSHIWAMBO
  }

  // Default banks (language-independent content)
  if (subject === 'math') {
    if (ageGroup === 'early-learners') return MATH_EARLY
    if (ageGroup === 'primary') return MATH_PRIMARY
    return MATH_TEEN
  }

  if (subject === 'english') {
    if (ageGroup === 'early-learners') return ENGLISH_EARLY
    if (ageGroup === 'primary') return ENGLISH_PRIMARY
    return ENGLISH_TEEN
  }

  // general-knowledge
  if (ageGroup === 'early-learners') return GK_EARLY
  if (ageGroup === 'primary') return GK_PRIMARY
  return GK_TEEN
}

// How many pairs to use per age group
export function pairCount(ageGroup: AgeGroup): number {
  if (ageGroup === 'early-learners') return 6
  if (ageGroup === 'primary') return 8
  return 10
}

// Grid columns per age group
export function gridCols(ageGroup: AgeGroup): number {
  if (ageGroup === 'early-learners') return 3
  return 4
}
