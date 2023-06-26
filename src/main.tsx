import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import App from './App'
import 'virtual:svg-icons-register'
import 'virtual:windi.css'
import '@/styles/reset.scss'
import '@/styles/common.scss'
import { Provider } from 'react-redux'
import { store, persistor } from '@/redux'
import { PersistGate } from 'redux-persist/integration/react'
import en_US from './locales/en_US'
import { ConfigProvider } from 'antd'
import { GOOGLE_CLIENT_ID } from './constant'
import { GoogleOAuthProvider } from '@react-oauth/google'

const messages = {
  en: en_US,
}
const lang = localStorage.getItem('lang') || 'en'
const message = messages[lang as keyof typeof messages]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <IntlProvider locale={lang} messages={message}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#2A4948',
            },
          }}
        >
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </ConfigProvider>
      </IntlProvider>
    </PersistGate>
  </Provider>
)
