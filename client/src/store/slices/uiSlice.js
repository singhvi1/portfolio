import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  navOpen: false,
  activeTag: null, // filter projects by tech tag, e.g. "React" — Projects page only
  activeTechCategory: null, // filter Technologies page by category
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNav(state) {
      state.navOpen = !state.navOpen
    },
    closeNav(state) {
      state.navOpen = false
    },
    setActiveTag(state, action) {
      // clicking the same tag again clears the filter
      state.activeTag = state.activeTag === action.payload ? null : action.payload
    },
    clearTag(state) {
      state.activeTag = null
    },
    setActiveTechCategory(state, action) {
      state.activeTechCategory = state.activeTechCategory === action.payload ? null : action.payload
    },
    clearTechCategory(state) {
      state.activeTechCategory = null
    },
  },
})

export const { toggleNav, closeNav, setActiveTag, clearTag, setActiveTechCategory, clearTechCategory } = uiSlice.actions
export default uiSlice.reducer
