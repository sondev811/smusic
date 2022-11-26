import { createSlice } from "@reduxjs/toolkit";

const queueReducer = createSlice({
  name: 'queue',
  initialState: {
    list: [],
    currentMusic: {},
    playlistName: '',
    playlistId: ''
  },
  reducers: {
    setPlaylistAction: (state, action) => {
      state.list = action.payload.list;
      state.currentMusic = action.payload.currentMusic;
      state.playlistName = action.payload.playlistName;
      state.playlistId = action.payload.playlistId;
    },
    setSongsPlaylistAction: (state, action) => {
      state.list = action.payload;
    },
    setPlaylistNameAction: (state, action) => {
      state.playlistName = action.payload;
    },
    setCurrentMusicAction: (state, action) => {
      state.currentMusic = action.payload;
    }
  }
});

// export const updateCurrentMusicThunk = createAsyncThunk('queue/updateCurrentMusic', async(music, playlist) => {
//   const result = await musicService.updateCurrentMusic(music.youtubeId, playlist.playlistId);
//   if (!result || !result.status) return;
//   return result;
// })

const {actions, reducer} = queueReducer;
export const { 
  setPlaylistAction, 
  setSongsPlaylistAction, 
  setPlaylistNameAction, 
  setCurrentMusicAction 
} = actions;

export default reducer;
