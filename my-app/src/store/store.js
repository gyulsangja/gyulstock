import { configureStore } from '@reduxjs/toolkit'
import darkmodeReducer from './darkModeSlice/darkModeSlice'
import stockDataReducer from './stockData/stockData'
import authDataReducer from './auth/auth'

export const store = configureStore({
  reducer: {
    darkMode: darkmodeReducer,
    stockData: stockDataReducer,
    authData: authDataReducer

  },
})