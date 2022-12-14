import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Information from './components/Infomation/Information';
import Login from './components/Login/Login';
import NotFound from './components/NotFound/NotFound';
import Playlist from './components/Playlist/Playlist';
import PlaylistDetail from './components/PlaylistDetails/PlaylistDetail';
import Queue from './components/Queue/Queue';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Search from './components/Search/Search';
import Signup from './components/Signup/Signup';
import './index.css';
import PrivateRoute from './middleware/private.route';
import reportWebVitals from './reportWebVitals';
import store from './store';
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="" element={<Home />} />
          <Route exact path="search" element={<Search />} />
          <Route exact path="queue" element={<Queue closeQueue={() => { console.log("Playing")}} />} />
          <Route exact path="playlist" element={<Playlist />} />
          <Route exact path="information" element={<Information />} />
          <Route exact path='playlist/:id' element={<PlaylistDetail />} />
        </Route>
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
