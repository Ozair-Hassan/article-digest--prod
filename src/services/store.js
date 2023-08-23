import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { articleApi } from './article'
import { translateApi } from './translate'

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    [translateApi.reducerPath]: translateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articleApi.middleware)
      .concat(translateApi.middleware),
})
