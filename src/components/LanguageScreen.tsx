import type { Language } from '../types'

interface Props {
  onSelect: (lang: Language) => void
}

const LANGUAGES: { id: Language; native: string; english: string; region: string; bg: string }[] = [
  { id: 'oshiwambo',      native: 'Oshiwambo',      english: 'Oshiwambo',      region: 'Northern Namibia · ~50% of population', bg: 'bg-red-500 hover:bg-red-600' },
  { id: 'khoekhoegowab',  native: 'Khoekhoegowab',  english: 'Khoekhoegowab',  region: 'Southern/Central · Nama & Damara',      bg: 'bg-orange-500 hover:bg-orange-600' },
  { id: 'afrikaans',      native: 'Afrikaans',       english: 'Afrikaans',      region: 'Widely used lingua franca',              bg: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'english',        native: 'English',         english: 'English',        region: 'Official · Government & schools',        bg: 'bg-emerald-500 hover:bg-emerald-600' },
]

export function LanguageScreen({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Choose Your Language</h1>
          <p className="text-2xl text-gray-500">Kies Jou Taal · Hala Oshilonga · ǁNâ ǀGôa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelect(lang.id)}
              className={`${lang.bg} text-white p-8 rounded-3xl shadow-xl transition-transform hover:scale-105 active:scale-95 text-left`}
            >
              <p className="text-4xl font-bold mb-1">{lang.native}</p>
              <p className="text-lg opacity-80">{lang.region}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
