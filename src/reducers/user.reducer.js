import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
  name: 'user',
  initialState: {
    email: null,
    name: null,
    password: null,
    currentPlaylist: null,
    queueListId: null,
    _id: null
  },
  reducers: {
    setUserAction: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.currentPlaylist = action.payload.currentPlaylist;
      state.queueListId = action.payload.queueListId;
      state._id = action.payload._id;
    }
  }
});

const { actions, reducer } = userReducer;
export const { setUserAction } = actions;
export default reducer;
