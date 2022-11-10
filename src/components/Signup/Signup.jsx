import React, { useState } from 'react';
import { RiNeteaseCloudMusicLine } from 'react-icons/ri';
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { setLoadingAction, setLoadingDoneAction } from '../../reducers/loading.reducer';
import authService from '../../services/auth.service';
import Loading from '../Loading/Loading';
import './Signup.scss';

function Signup() {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({
    error: '',
    passwordNotMatch: false
  });
  const navigate = useNavigate();

  if (authService.isAuthenticated()) {
    return <Navigate to="/" push={true} />;
  }

  const handleChangeUserName = (event) => setUserName(event.target.value);
  const handleChangePassword = (event) => setPassword(event.target.value);
  const handleChangeConfirmPassword = (event) =>
    setConfirmPassword(event.target.value);
  const handleChangeName = (event) => setName(event.target.value);

  const signUp = async (e) => {
    e.preventDefault();
    if (!userName || !password || !confirmPassword || !name) {
      setErrors({
        error: 'Tài khoản, Mật khẩu, Nhập lại mật khẩu, Tên là bắt buộc'
      });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({
        error: 'Mật khẩu đã nhập không trùng khớp',
        passwordNotMatch: true
      });
      return;
    }
    const body = {
      email: userName.trim().toLowerCase(),
      password,
      name
    };
    setErrors({
      error: '',
      passwordNotMatch: false
    });

    const res = await authService.signUp(body);
    if (!res) {
      return;
    }
    if (!res.status && !res.result) {
      setErrors({
        error: res.error
      });
      return;
    }
    dispatch(
      setLoadingAction({
        content: 'Đăng ký thành công, đang chuyển sang đăng nhập...'
      })
    );
    setTimeout(() => {
      dispatch(setLoadingDoneAction({ content: ''}));
      return navigate('/login');
    }, 5000);
  };

  return (
    <div className="login">
      <div className="login__logo">
        <RiNeteaseCloudMusicLine />
        SMusic
      </div>
      <div className="login__form">
        <form onSubmit={signUp}>
          <div className="login__form--items">
            <label htmlFor="username">Email hoặc tên đăng nhập *</label>
            <input
              type="text"
              name="username"
              className={errors.error && !userName ? 'input-error' : ''}
              id="username"
              placeholder="Email hoặc tên đăng nhập."
              value={userName}
              onChange={handleChangeUserName}
            />
          </div>
          <div className="login__form--items">
            <label htmlFor="password">Tạo một mật khẩu *</label>
            <input
              type="password"
              name="password"
              className={
                errors.error && (!password || errors.passwordNotMatch)
                  ? 'input-error'
                  : ''
              }
              id="password"
              placeholder="Tạo một mật khẩu."
              value={password}
              onChange={handleChangePassword}
            />
          </div>
          <div className="login__form--items">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu *</label>
            <input
              type="password"
              className={
                errors.error && (!confirmPassword || errors.passwordNotMatch)
                  ? 'input-error'
                  : ''
              }
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu."
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
            />
          </div>
          <div className="login__form--items">
            <label htmlFor="name">Chúng tôi nên gọi cho bạn là gì?</label>
            <input
              type="text"
              name="name"
              className={errors.error && !name ? 'input-error' : ''}
              id="name"
              placeholder="Nhập tên của bạn."
              value={name}
              onChange={handleChangeName}
            />
          </div>
          <div className="login__form--error">{errors.error}</div>
          <button>Đăng ký</button>
        </form>
      </div>
      <div className="sign-up">
        <p>Bạn đã có tài khoản?</p>
        <NavLink to="/login">Đăng nhập</NavLink>
      </div>
      <Loading />
    </div>
  );
}

export default Signup;
