import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ptBR } from '@/i18n/locales/pt-BR'

const resources = {
  'pt-BR': {
    translation: ptBR
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n