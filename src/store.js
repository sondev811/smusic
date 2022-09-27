import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './reducers/loading.reducer';
import userReducer from './reducers/user.reducer';
import queueReducer from './reducers/queue.reducer';
import playerReducer from './reducers/player.reducer';
import searchReducer from './reducers/search.reducer';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    queue: queueReducer,
    player: playerReducer,
    search: searchReducer
  }
})
export default store;
