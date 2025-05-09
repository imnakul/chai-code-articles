import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   articles: [],
}

const articleSlice = createSlice({
   name: 'article',
   initialState,
   reducers: {
      setArticles: (state, action) => {
         state.articles = action.payload
      },
      clearArticles: (state) => {
         state.articles = []
      },
   },
})

export const { setArticles, clearArticles } = articleSlice.actions
export default articleSlice.reducer
