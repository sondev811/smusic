const initialState = {
  list: [],
  currentMusic: {},
  playlistName: '',
  playlistId: ''
};
const queueReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLAYLIST':
      return {
        ...state,
        list: action.payload.list,
        currentMusic: action.payload.currentMusic,
        playlistName: action.payload.playlistName,
        playlistId: action.payload.playlistId
      };
    case 'PLAYLIST_ITEM':
      return {
        ...state,
        list: action.payload
      };
    case 'PLAYLIST_NAME':
      return {
        ...state,
        playlistName: action.payload
      }
    case 'CURRENT_MUSIC':
      return {
        ...state,
        currentMusic: action.payload
      };
    default:
      return state;
  }
};
export default queueReducer;
