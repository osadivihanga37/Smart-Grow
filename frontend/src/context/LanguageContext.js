import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // Load saved language when app starts
    AsyncStorage.getItem('app_language').then(saved => {
      if (saved) setLang(saved)
    })
  }, [])

  const changeLanguage = async (newLang) => {
    setLang(newLang)
    await AsyncStorage.setItem('app_language', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)