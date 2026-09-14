export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  popular?: boolean;
  voiceLang: string;
  fallbackCode: string;
  sampleGreeting: string; // used for natural greetings e.g. "Ela unnav?"
}

export const WORLD_LANGUAGES: LanguageOption[] = [
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    locale: 'te-IN',
    popular: true,
    voiceLang: 'te-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Ela unnav?'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    locale: 'hi-IN',
    popular: true,
    voiceLang: 'hi-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Kaise ho?'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-US',
    popular: true,
    voiceLang: 'en-US',
    fallbackCode: 'en',
    sampleGreeting: 'How are you feeling today?'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    locale: 'ta-IN',
    popular: true,
    voiceLang: 'ta-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Epdi irukeenga?'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    locale: 'kn-IN',
    popular: true,
    voiceLang: 'kn-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Hegidhdheera?'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    locale: 'mr-IN',
    popular: true,
    voiceLang: 'mr-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Kase aahat?'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    locale: 'bn-IN',
    popular: true,
    voiceLang: 'bn-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Kemon aacho?'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    locale: 'ml-IN',
    popular: true,
    voiceLang: 'ml-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Sugamano?'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    locale: 'gu-IN',
    popular: true,
    voiceLang: 'gu-IN',
    fallbackCode: 'en',
    sampleGreeting: 'Kem chho?'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    locale: 'es-ES',
    popular: true,
    voiceLang: 'es-ES',
    fallbackCode: 'en',
    sampleGreeting: '¿Cómo estás?'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    locale: 'fr-FR',
    popular: true,
    voiceLang: 'fr-FR',
    fallbackCode: 'en',
    sampleGreeting: 'Comment vas-tu ?'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    locale: 'de-DE',
    popular: true,
    voiceLang: 'de-DE',
    fallbackCode: 'en',
    sampleGreeting: 'Wie geht es dir?'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    locale: 'ja-JP',
    popular: true,
    voiceLang: 'ja-JP',
    fallbackCode: 'en',
    sampleGreeting: 'Genki desu ka?'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    locale: 'ko-KR',
    popular: true,
    voiceLang: 'ko-KR',
    fallbackCode: 'en',
    sampleGreeting: 'Jal jinaeyo?'
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '中文',
    locale: 'zh-CN',
    popular: true,
    voiceLang: 'zh-CN',
    fallbackCode: 'en',
    sampleGreeting: 'Nǐ hǎo ma?'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    locale: 'ar-SA',
    popular: true,
    voiceLang: 'ar-SA',
    fallbackCode: 'en',
    sampleGreeting: 'Kayfa haluk?'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    locale: 'pt-BR',
    popular: true,
    voiceLang: 'pt-BR',
    fallbackCode: 'en',
    sampleGreeting: 'Como você está?'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    locale: 'ru-RU',
    popular: false,
    voiceLang: 'ru-RU',
    fallbackCode: 'en',
    sampleGreeting: 'Kak dela?'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    locale: 'it-IT',
    popular: false,
    voiceLang: 'it-IT',
    fallbackCode: 'en',
    sampleGreeting: 'Come stai?'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    locale: 'tr-TR',
    popular: false,
    voiceLang: 'tr-TR',
    fallbackCode: 'en',
    sampleGreeting: 'Nasılsın?'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    locale: 'vi-VN',
    popular: false,
    voiceLang: 'vi-VN',
    fallbackCode: 'en',
    sampleGreeting: 'Bạn khỏe không?'
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    locale: 'id-ID',
    popular: false,
    voiceLang: 'id-ID',
    fallbackCode: 'en',
    sampleGreeting: 'Apa kabar?'
  }
];

export function getLanguageByCode(code?: string): LanguageOption {
  if (!code) return WORLD_LANGUAGES.find(l => l.code === 'en')!;
  const found = WORLD_LANGUAGES.find(
    l => l.code.toLowerCase() === code.toLowerCase() || l.name.toLowerCase() === code.toLowerCase()
  );
  return found || WORLD_LANGUAGES.find(l => l.code === 'en')!;
}

export function getLanguageName(code?: string): string {
  return getLanguageByCode(code).name;
}
