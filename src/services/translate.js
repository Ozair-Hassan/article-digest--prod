import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rapidApiKey = import.meta.env.VITE_Rapid_API_ARTICLE_KEY

export const translateApi = createApi({
  reducerPath: 'translateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://text-translator2.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/x-www-form-urlencoded')
      headers.set(
        'X-RapidAPI-Key',
        'f01af9b5admsh9d6a70c25e28d7cp12ba25jsn7e5e7fe3a622'
      )
      headers.set('X-RapidAPI-Host', 'text-translator2.p.rapidapi.com')
      return headers
    },
  }),
  endpoints: (builder) => ({
    getLanguages: builder.query({
      query: () => `/getLanguages`,
    }),
    getTranslate: builder.mutation({
      query: (body) => ({ url: 'translate', method: 'POST', body }),
    }),
  }),
})
export const { useGetTranslateMutation, useLazyGetLanguagesQuery } =
  translateApi
// const api = createApi({
//   baseQuery,
//   endpoints: (build) => ({
//     updatePost: build.mutation({
//       query: ({ id, ...patch }) => ({ url: `post/${id}`, method: 'PATCH', body: patch }),
//       // Pick out data and prevent nested properties in a hook or selector
//       transformResponse: (response) => response.data,
//       // Pick out error and prevent nested properties in a hook or selector
//       transformErrorResponse: (response) => response.error,
//       // `result` is the server response
//       invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
//      // trigger side effects or optimistic updates
//      onQueryStarted(id, { dispatch, getState, extra, requestId, queryFulfilled, getCacheEntry }) {},
//      // handle subscriptions etc
//      onCacheEntryAdded(id, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry }) {},
//     }),
//   }),
// });
