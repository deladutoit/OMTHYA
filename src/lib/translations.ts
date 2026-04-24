import type { Language } from '../types'

export interface T {
  // Language screen
  chooseLanguage: string
  languageNativeName: string

  // Welcome
  welcomeTitle: string
  welcomeSubtitle: string
  namePlaceholder: string
  startBtn: string
  loadingBtn: string
  nameRequired: string

  // Menu
  greeting: string
  chooseAdventure: string
  earlyLearners: string
  earlyLearnersAges: string
  primary: string
  primaryAges: string
  teen: string
  teenAges: string
  offlineGames: string
  offlineDesc: string
  requiresInternet: string

  // Subject
  chooseSubject: string
  english: string
  englishDesc: string
  math: string
  mathDesc: string
  generalKnowledge: string
  generalKnowledgeDesc: string
  back: string

  // Loading
  generatingLesson: string

  // Quiz
  question: string
  of: string
  checkKnowledge: string

  // Quiz result
  greatJob: string
  goodJob: string
  keepPractising: string
  youScored: string
  outOf: string
  continueBtn: string

  // End
  thankYou: string
  sessionComplete: string
  encouragement: string
  newSession: string
  keepLearning: string

  // Errors
  lessonUnavailable: string
  lessonError: string
  tryAgain: string
  goBack: string

  // Shared game strings
  playAgain: string
  points: string
  menu: string

  // MemoryFlip
  pairsWord: string
  attemptsWord: string

  // WordScramble
  tapLettersBelow: string
  hintBtn: string
  checkBtn: string
  skipBtn: string
  correctMsg: string
  wrongMsg: string

  // QuickTap
  timesUp: string        // "⏱ Time's up! Answer: {answer}"

  // TrueOrFalse
  trueBtn: string
  falseBtn: string
  timesUpWas: string     // "⏱ Time's up! Answer was: {answer}"

  // Hangman / Balloon Pop
  balloonsLeft: string   // "{n} 🎈 left"
  wordWas: string        // "💨 All popped! The word was: {word}"
  pointsEarned: string   // "🎈 +{n} points!"

  // Token system
  noSoccerTokens: string
  soccerTokenEarned: string

  // Soccer
  swipeToShoot: string
  goalMsg: string
  savedMsg: string
  missMsg: string
  wideMsg: string
  overBarMsg: string
  goalsScored: string
  soccerRating5: string
  soccerRating4: string
  soccerRating3: string
  soccerRating2: string
  soccerRating1: string
  soccerRating0: string
}

const en: T = {
  chooseLanguage: 'Choose Your Language',
  languageNativeName: 'English',

  welcomeTitle: 'Welcome to Education Station',
  welcomeSubtitle: "What's your name?",
  namePlaceholder: 'Enter your name',
  startBtn: "Let's Go!",
  loadingBtn: 'Getting ready…',
  nameRequired: 'Please enter your name to continue',

  greeting: 'Hello, {name}!',
  chooseAdventure: 'Choose your learning adventure',
  earlyLearners: 'Early Learners',
  earlyLearnersAges: 'Ages 3 – 6',
  primary: 'Primary',
  primaryAges: 'Ages 7 – 12',
  teen: 'Teen+',
  teenAges: 'Ages 13+',
  offlineGames: 'Games & Activities',
  offlineDesc: 'Play without internet',
  requiresInternet: 'Needs internet',

  chooseSubject: 'What would you like to learn?',
  english: 'English',
  englishDesc: 'Reading & Writing',
  math: 'Mathematics',
  mathDesc: 'Numbers & Logic',
  generalKnowledge: 'General Knowledge',
  generalKnowledgeDesc: 'Science & World',
  back: 'Back',

  generatingLesson: 'Generating your lesson…',

  question: 'Question',
  of: 'of',
  checkKnowledge: "Let's test your knowledge!",

  greatJob: 'Excellent! 🌟',
  goodJob: 'Well done! 🎉',
  keepPractising: 'Keep practising! 💪',
  youScored: 'You scored',
  outOf: 'out of',
  continueBtn: 'Continue',

  thankYou: 'Great work, {name}! 🏆',
  sessionComplete: 'You completed your learning session!',
  encouragement: 'Keep learning something new every day.',
  newSession: 'Start New Session',
  keepLearning: 'Keep Learning',

  lessonUnavailable: 'Lesson Unavailable',
  lessonError: "We couldn't load your lesson. Please try again.",
  tryAgain: 'Try Again',
  goBack: 'Go Back',

  playAgain: 'Play Again',
  points: 'points',
  menu: 'Menu',

  pairsWord: 'pairs',
  attemptsWord: 'attempts',

  tapLettersBelow: 'Tap letters below…',
  hintBtn: 'Hint',
  checkBtn: 'Check',
  skipBtn: 'Skip',
  correctMsg: '✅ Correct!',
  wrongMsg: '❌ Try again',

  timesUp: "⏱ Time's up! Answer: {answer}",

  trueBtn: '✅ TRUE',
  falseBtn: '❌ FALSE',
  timesUpWas: "⏱ Time's up! Answer was: {answer}",

  balloonsLeft: '{n} 🎈 left',
  wordWas: '💨 All popped! The word was: {word}',
  pointsEarned: '🎈 +{n} points!',

  noSoccerTokens: 'Finish a lesson to earn a play!',
  soccerTokenEarned: '⚽ You earned a soccer play!',

  swipeToShoot: 'Swipe up from the ball to shoot',
  goalMsg: 'GOAL! 🎉',
  savedMsg: 'SAVED! 🧤',
  missMsg: 'MISS!',
  wideMsg: 'WIDE!',
  overBarMsg: 'OVER THE BAR!',
  goalsScored: 'goals scored',
  soccerRating5: '🏆 Perfect! Unstoppable!',
  soccerRating4: '⭐ World Class Striker!',
  soccerRating3: '🔥 Great Shot!',
  soccerRating2: '👍 Not Bad!',
  soccerRating1: '💪 Keep Practising!',
  soccerRating0: '😅 The keeper wins this time!',
}

const af: T = {
  chooseLanguage: 'Kies Jou Taal',
  languageNativeName: 'Afrikaans',

  welcomeTitle: 'Welkom by Opvoedingstasie',
  welcomeSubtitle: 'Wat is jou naam?',
  namePlaceholder: 'Tik jou naam in',
  startBtn: 'Kom ons gaan!',
  loadingBtn: 'Maak gereed…',
  nameRequired: 'Voer asseblief jou naam in om voort te gaan',

  greeting: 'Hallo, {name}!',
  chooseAdventure: 'Kies jou leeravontuur',
  earlyLearners: 'Vroeë Leerders',
  earlyLearnersAges: 'Ouderdomme 3 – 6',
  primary: 'Primêr',
  primaryAges: 'Ouderdomme 7 – 12',
  teen: 'Tiener+',
  teenAges: 'Ouderdomme 13+',
  offlineGames: 'Speletjies & Aktiwiteite',
  offlineDesc: 'Speel sonder internet',
  requiresInternet: 'Benodig internet',

  chooseSubject: 'Wat wil jy leer?',
  english: 'Engels',
  englishDesc: 'Lees & Skryf',
  math: 'Wiskunde',
  mathDesc: 'Getalle & Logika',
  generalKnowledge: 'Algemene Kennis',
  generalKnowledgeDesc: 'Wetenskap & Wêreld',
  back: 'Terug',

  generatingLesson: 'Genereer jou les…',

  question: 'Vraag',
  of: 'uit',
  checkKnowledge: 'Kom ons toets jou kennis!',

  greatJob: 'Uitstekend! 🌟',
  goodJob: 'Goed gedaan! 🎉',
  keepPractising: 'Oefen meer! 💪',
  youScored: 'Jy het',
  outOf: 'uit',
  continueBtn: 'Gaan voort',

  thankYou: 'Goed gedaan, {name}! 🏆',
  sessionComplete: 'Jy het jou leersessie voltooi!',
  encouragement: 'Bly elke dag iets nuuts leer.',
  newSession: 'Begin Nuwe Sessie',
  keepLearning: 'Bly Leer',

  lessonUnavailable: 'Les Nie Beskikbaar',
  lessonError: 'Ons kon nie die les laai nie. Probeer asseblief weer.',
  tryAgain: 'Probeer Weer',
  goBack: 'Gaan Terug',

  playAgain: 'Speel Weer',
  points: 'punte',
  menu: 'Kieslys',

  pairsWord: 'pare',
  attemptsWord: 'pogings',

  tapLettersBelow: 'Tik letters hieronder…',
  hintBtn: 'Wenk',
  checkBtn: 'Kyk',
  skipBtn: 'Slaan oor',
  correctMsg: '✅ Korrek!',
  wrongMsg: '❌ Probeer weer',

  timesUp: '⏱ Tyd verstreke! Antwoord: {answer}',

  trueBtn: '✅ WAAR',
  falseBtn: '❌ ONWAAR',
  timesUpWas: '⏱ Tyd verstreke! Antwoord was: {answer}',

  balloonsLeft: '{n} 🎈 oor',
  wordWas: '💨 Almal gebars! Die woord was: {word}',
  pointsEarned: '🎈 +{n} punte!',

  noSoccerTokens: 'Voltooi \'n les om \'n speel te verdien!',
  soccerTokenEarned: '⚽ Jy het \'n sokkerspeel verdien!',

  swipeToShoot: 'Vee op van die bal af om te skop',
  goalMsg: 'DOEL! 🎉',
  savedMsg: 'GESTOP! 🧤',
  missMsg: 'MIS!',
  wideMsg: 'WYD!',
  overBarMsg: 'OOR DIE DOELIYNE!',
  goalsScored: 'doele aangeteken',
  soccerRating5: '🏆 Perfek! Onstopbaar!',
  soccerRating4: '⭐ Wêreldklas!',
  soccerRating3: '🔥 Goeie Skop!',
  soccerRating2: '👍 Nie Sleg Nie!',
  soccerRating1: '💪 Oefen Meer!',
  soccerRating0: '😅 Die doelwagter wen hierdie keer!',
}

const oshi: T = {
  chooseLanguage: 'Hala Oshilonga Shobe',
  languageNativeName: 'Oshiwambo',

  welcomeTitle: 'Ongi Nongoye mo Education Station',
  welcomeSubtitle: 'Edhina lyobe oshike?',
  namePlaceholder: 'Andika edhina lyobe',
  startBtn: 'Atu tange!',
  loadingBtn: 'Otu lombwela…',
  nameRequired: 'Andika edhina lyobe opo tu tange',

  greeting: 'Ongi nongoye, {name}!',
  chooseAdventure: 'Hala eendalo yobe yokuliwa',
  earlyLearners: 'Aaliwa Aatango',
  earlyLearnersAges: 'Omyaka 3 – 6',
  primary: 'Omulongo Gwatango',
  primaryAges: 'Omyaka 7 – 12',
  teen: 'Aanona+',
  teenAges: 'Omyaka 13+',
  offlineGames: 'Omilulu & Eendalo',
  offlineDesc: 'Lunga shaashi internet',
  requiresInternet: 'Oku kala internet',

  chooseSubject: 'Omulongo guni ogumwe longele okutalela?',
  english: 'Oshipalekwa',
  englishDesc: 'Okuhenga & Okutila',
  math: 'Ombalangondo',
  mathDesc: 'Omanamba & Okunanena',
  generalKnowledge: 'Uuyelele Woondjaba',
  generalKnowledgeDesc: 'Uuyelele & Omalambo',
  back: 'Galuka',

  generatingLesson: 'Otu lombwela omulongo…',

  question: 'Ombuzo',
  of: 'komeho ya',
  checkKnowledge: 'Atu kale uuyelele wobe!',

  greatJob: 'Owa li nawa nawa! 🌟',
  goodJob: 'Owa li nawa! 🎉',
  keepPractising: 'Tya piti nokupractise! 💪',
  youScored: 'Owa pewa',
  outOf: 'komeho ya',
  continueBtn: 'Tya Piti',

  thankYou: 'Tangi unene, {name}! 🏆',
  sessionComplete: 'Owa mana omulongo gwobe gwokuliwa!',
  encouragement: 'Tya piti nokukala okuliwa iinima iipya omalanga gondje.',
  newSession: 'Tanga Omulongo Gumwe',
  keepLearning: 'Tya piti nokukala',

  lessonUnavailable: 'Omulongo Agu Hole',
  lessonError: 'Atu kala okuload omulongo. Kala gumwe.',
  tryAgain: 'Kala Gumwe',
  goBack: 'Galuka',

  playAgain: 'Luka Gumwe',
  points: 'iipoints',
  menu: 'Ehalo',

  pairsWord: 'omaumbo',
  attemptsWord: 'iinakufama',

  tapLettersBelow: 'Tumba iireta moomu…',
  hintBtn: 'Etaloko',
  checkBtn: 'Talela',
  skipBtn: 'Pita',
  correctMsg: '✅ Owa longwa nawa!',
  wrongMsg: '❌ Kala gumwe',

  timesUp: '⏱ Ongula yeli piti! Eyambo: {answer}',

  trueBtn: '✅ NAWA',
  falseBtn: '❌ INANO',
  timesUpWas: '⏱ Ongula yeli piti! Eyambo laali: {answer}',

  balloonsLeft: '{n} 🎈 yali',
  wordWas: '💨 Oshi manguluka! Oshihopapolwa shaali: {word}',
  pointsEarned: '🎈 +{n} iipoints!',

  noSoccerTokens: 'Mana omulongo opo u dule oluka!',
  soccerTokenEarned: '⚽ Owa pewa oluka losokkere!',

  swipeToShoot: 'Shefa po nombolo opo u dule okuhepa',
  goalMsg: 'GOAL! 🎉',
  savedMsg: 'OWA HUPITHA! 🧤',
  missMsg: 'OWA PUKA!',
  wideMsg: 'OSHIWANAWA!',
  overBarMsg: 'OPOMBANDA!',
  goalsScored: 'iigoal yandjwa',
  soccerRating5: '🏆 Shaali nawa! Aapu na sha kukufa!',
  soccerRating4: '⭐ Oshaambulukwa!',
  soccerRating3: '🔥 Ohepa nawa!',
  soccerRating2: '👍 Ita iihela!',
  soccerRating1: '💪 Tya piti nokupractise!',
  soccerRating0: '😅 Omupilisi wa hupitha omanga!',
}

// Khoekhoegowab translations — reviewed for accuracy where possible.
// Professional linguistic review recommended before production use.
const khoe: T = {
  chooseLanguage: 'ǁNâ ǀGôa ǂGai',
  languageNativeName: 'Khoekhoegowab',

  welcomeTitle: 'ǀGôa Education Station ǁnân',
  welcomeSubtitle: 'Tare ǀgôa ǀgam?',
  namePlaceholder: 'Tare ǀgôa andika',
  startBtn: 'ǁNâ tama!',
  loadingBtn: 'ǁNâ ǀgao…',
  nameRequired: 'Tare ǀgôa andika ǁnâ tama ge',

  greeting: 'Matisa, {name}!',
  chooseAdventure: 'Tsî ǀhui ǀgai khoeda hala',
  earlyLearners: 'ǀHui-ǀhuigu Tama',
  earlyLearnersAges: 'ǀKhâu 3 – 6',
  primary: 'ǀHui Khoeda',
  primaryAges: 'ǀKhâu 7 – 12',
  teen: 'ǀGâi+',
  teenAges: 'ǀKhâu 13+',
  offlineGames: 'ǀGao & ǀHui',
  offlineDesc: 'ǀGao internet ǀkae',
  requiresInternet: 'Internet ǂgan',

  chooseSubject: 'ǀHui mâ ge ǁnâ hala?',
  english: 'Engelsǀgâi',
  englishDesc: 'ǀHore & Andika',
  math: 'ǀKhâugu',
  mathDesc: 'ǀKhâu & ǀNanagu',
  generalKnowledge: 'ǀHui ǀGâi',
  generalKnowledgeDesc: 'ǀGâi & ǀHui',
  back: 'ǀGao',

  generatingLesson: 'ǀHui ǁnâ ǀgao…',

  question: 'ǀHuiǁgâi',
  of: 'ǀhui',
  checkKnowledge: 'ǁNâ tsî ǀhui kale!',

  greatJob: 'ǀHui nawa nawa! 🌟',
  goodJob: 'ǀHui nawa! 🎉',
  keepPractising: 'ǁNâ tama kale! 💪',
  youScored: 'Ge ǀgao',
  outOf: 'ǀhui',
  continueBtn: 'Tama',

  thankYou: 'Gangams, {name}! 🏆',
  sessionComplete: 'ǀHui nawa ge ǀgao ǀhui!',
  encouragement: 'ǁNâ tama ǀhui ǀgâi ǀgâi oalaga.',
  newSession: 'ǀHui ǀGâi Tama',
  keepLearning: 'ǁNâ tama kale',

  lessonUnavailable: 'ǀHui ǀGâi ǀHole',
  lessonError: 'ǀHui ǀgâi load ǀkae. ǀGumwe kale.',
  tryAgain: 'ǀGumwe Kale',
  goBack: 'ǀGao',

  playAgain: 'ǀGao ǀGumwe',
  points: 'ǀhui',
  menu: 'ǀHui',

  pairsWord: 'ǀhui-ǀhui',
  attemptsWord: 'ǀgao',

  tapLettersBelow: 'ǀGui ǀhui ǀkae…',
  hintBtn: 'ǀHui',
  checkBtn: 'ǀGao',
  skipBtn: 'ǁNâ',
  correctMsg: '✅ ǀHui nawa!',
  wrongMsg: '❌ ǀGumwe kale',

  timesUp: '⏱ ǀKhâu ǀgao! ǀGaos: {answer}',

  trueBtn: '✅ ǀHUI',
  falseBtn: '❌ ǀKAE',
  timesUpWas: '⏱ ǀKhâu ǀgao! ǀGaos laali: {answer}',

  balloonsLeft: '{n} 🎈 ǀkae',
  wordWas: '💨 ǀGao! ǀHui laali: {word}',
  pointsEarned: '🎈 +{n} ǀhui!',

  noSoccerTokens: 'ǀHui ǀgai ǀgao ǀgumwe!',
  soccerTokenEarned: '⚽ ǀGao ǀgumwe ǀhui!',

  swipeToShoot: 'ǀGui ǀhui ǀkae ǀgao',
  goalMsg: 'GOAL! 🎉',
  savedMsg: 'ǀGAO! 🧤',
  missMsg: 'ǀKAE!',
  wideMsg: 'ǀNAMA!',
  overBarMsg: 'ǀGÂI ǀKAE!',
  goalsScored: 'ǀhui ǀgao',
  soccerRating5: '🏆 ǀHui nawa nawa!',
  soccerRating4: '⭐ ǀHui ǀGâi!',
  soccerRating3: '🔥 ǀHui nawa!',
  soccerRating2: '👍 ǀHui!',
  soccerRating1: '💪 ǁNâ tama kale!',
  soccerRating0: '😅 ǀGao ǁnâ tama!',
}

export const translations: Record<Language, T> = {
  english: en,
  afrikaans: af,
  oshiwambo: oshi,
  khoekhoegowab: khoe,
}

export function t(
  lang: Language,
  key: keyof T,
  vars?: Record<string, string>,
): string {
  let text = translations[lang][key]
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v)
    }
  }
  return text
}
