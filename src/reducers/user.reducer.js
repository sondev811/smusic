const initialState = {
  email: null,
  name: null,
  password: null,
  currentPlaylist: null,
  queueListId: null,
  _id: null
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload;
    default:
      return state;
  }
};
export default userReducer;
