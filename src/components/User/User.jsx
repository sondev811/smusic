import React, { useEffect, useRef, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi';
import { setQueueAction } from '../../actions/queue.action';
import { setUserAction } from '../../actions/user.action';
import { useAppDispatch, useOutside } from '../../hooks';
import authService from '../../services/auth.service';
import userService from '../../services/user.service';
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
      if (!response || !response.result) return;
      setUserInfo(response.result.userInfo);
      dispatch(setUserAction(response.result));
      const queueList = response.result.queue;
      let currentMusic = response.result.currentMusic;
      const queueAction = {
        queueList,
        currentMusic
      };
      dispatch(setQueueAction(queueAction));
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
            <li onClick={logout}>Đăng xuất</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default User;
