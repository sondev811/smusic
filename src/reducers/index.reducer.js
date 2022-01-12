import { combineReducers } from 'redux';
import loadingReducer from './loading.reducer';
import playerReducer from './player.reducer';
import queueReducer from './queue.reducer';
import searchReducer from './search.reducer';
import userReducer from './user.reducer';

const rootReducer = combineReducers({
  loading: loadingReducer,
  user: userReducer,
  queue: queueReducer,
  player: playerReducer,
  search: searchReducer
});
export default rootReducer;
