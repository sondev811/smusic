import { createSlice } from "@reduxjs/toolkit";

const loadingReducer = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    content: ''
  },
  reducers: {
    setLoadingAction: (state, action) => {
      state.isLoading = action.payload.isLoading;
      state.content = action.payload.content;
    }
  }
});
const { actions, reducer } = loadingReducer;
export const { setLoadingAction } = actions;
export default reducer;
