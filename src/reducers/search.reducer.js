import { createSlice } from "@reduxjs/toolkit";

const searchReducer = createSlice({
  name: 'search',
  initialState: {
    isTyping: false,
    searchHistory: []
  },
  reducers: {
    setSearchTypingAction: (state, action) => {
      state.isTyping = action.payload;
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
    }
  }
})

const { actions, reducer } = searchReducer;
export const { setSearchTypingAction, setSearchHistory } = actions;
export default reducer;
