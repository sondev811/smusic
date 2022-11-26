import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useOutside } from '../../hooks';
import { setPlaylistAction } from '../../reducers/queue.reducer';
import { setUserAction } from '../../reducers/user.reducer';
import { authService } from '../../services/auth.service';
import { musicService } from '../../services/music.service';
import { userService } from '../../services/user.service';
import './User.scss';

function User() {
  const [isOpenUser, setOpenUser] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const dispatch = useAppDispatch();
  const user = useRef(null);
  useOutside(user, () => setOpenUser(false));
  useEffect(() => {
    const getUserInfo = async () => {
      let response = await userService.getUserInfo();
      if (!response || !response.result || !response.result.userInfo || !response.result.queue) return;
      setUserInfo(response.result.userInfo);
      dispatch(setUserAction(response.result.userInfo));
      const list = response.result.queue.list;
      const playlistId = response.result.queue._id;
      let currentMusic = response.result.queue.currentMusic;
      if (!currentMusic && response.result.queue.list.length) {
        currentMusic = response.result.queue.list[0];
        await musicService.updateCurrentMusic(currentMusic.youtubeId, playlistId);
      }
      const playlistName = response.result.queue.playlistName;
      const playlist = {
        list,
        currentMusic,
        playlistName,
        playlistId
      };
      dispatch(setPlaylistAction(playlist));
    };
    getUserInfo();
  }, [dispatch]);

  const clickUser = () => {
    setOpenUser(!isOpenUser);
  };
  const logout = () => {
    authService.logout();
  };
  return (
    <div className="user" ref={user}>
      <div className={`user__name ${isOpenUser ? 'active-user' : ''}`}>
        <div
          className="user__name--info"
          onClick={clickUser}
          style={{ padding: '.3rem 1rem' }}
        >
          <span> {userInfo.name} </span>
          <div>
            {' '}
            <AiFillCaretDown />
          </div>
        </div>
        <span className="user__name--mobile" onClick={clickUser}>
          <BiUserCircle />
        </span>
        <div className={`user__name--child ${isOpenUser ? 'active' : ''}`}>
          <ul>
            <li onClick={() => setOpenUser(false)}>
              <NavLink to="/information">
                Thông tin ứng dụng
              </NavLink>
            </li>
            <li onClick={logout}>Đăng xuất</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default User;
