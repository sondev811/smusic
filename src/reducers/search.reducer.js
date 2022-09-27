import { createSlice } from "@reduxjs/toolkit";

const searchReducer = createSlice({
  name: 'search',
  initialState: {
    isTyping: false
  },
  reducers: {
    setSearchTypingAction: (state, action) => {
      state.isTyping = action.payload;
    }
  }
})

const { actions, reducer } = searchReducer;
export const { setSearchTypingAction } = actions;
export default reducer;
