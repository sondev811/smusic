import { createSlice } from "@reduxjs/toolkit";

const loadingReducer = createSlice({
  name: 'loading',
  initialState: {
    loadingCount: 0,
    content: ''
  },
  reducers: {
    setLoadingAction: (state, action) => {
      state.loadingCount += 1;
      state.content = action.payload.content;
    },
    setLoadingDoneAction: (state) => {
      if (state.loadingCount > 0) {
        state.loadingCount -= 1
      } 
      state.content = '';
    }
  }
});
const { actions, reducer } = loadingReducer;
export const { setLoadingAction, setLoadingDoneAction } = actions;
export default reducer;
