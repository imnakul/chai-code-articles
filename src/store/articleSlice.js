import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   articles: [],
   socials: {},
}

const articleSlice = createSlice({
   name: 'article',
   initialState,
   reducers: {
      setArticles: (state, action) => {
         state.articles = action.payload
      },
      setSocials: (state, action) => {
         state.socials = action.payload
      },
      clearArticles: (state) => {
         state.articles = []
         state.socials = {}
      },
      clearSocials: (state) => {
         state.socials = {}
      },
   },
})

export const { setArticles, setSocials, clearArticles, clearSocials } =
   articleSlice.actions
export default articleSlice.reducer
