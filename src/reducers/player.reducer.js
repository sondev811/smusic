import { createSlice } from "@reduxjs/toolkit";

const playerReducer = createSlice({
  name: 'player',
  initialState: {
    volume: 0.5
  },
  reducers: {
    setVolumeAction: (state, action) => {
      state.volume = action.payload;
    }
  }
});
const { actions, reducer} = playerReducer;
export const { setVolumeAction } = actions;
export default reducer;
