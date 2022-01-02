import React, { useState } from 'react';
import { RiNeteaseCloudMusicLine } from "react-icons/ri";
import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { setLoadingAction } from '../../actions/loading.action';
import { useAppDispatch } from '../../hooks';
import authService from '../../services/auth.service';
import Loading from '../Loading/Loading';
import './Login.scss';
function Login(props) {
    const dispatch = useAppDispatch();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    
    if (authService.isAuthenticated()) {
        return <Navigate to="/" push={true} />
    }

    const login = async () => {
        if (!userName || !password) {
            setErrors('Email and password is required');
            return;
        }
        const body = {
            email: userName,
            password
        }
        setErrors('');
        dispatch(setLoadingAction({isLoading: true, content: ''}));
        const res = await authService.login(body);
        if (!res) {
            return;
        }
        if (!res.status && !res.result) {
            setErrors(res.error);
            return;
        }
        authService.setLocalStorage('token', res.result.accessToken);
        return navigate('/');
    }

    const handleChangeUserName = (event) => setUserName(event.target.value);
    const handleChangePassword = (event) => setPassword(event.target.value);
   
    return (
        <div className='login'>
            <div className='login__logo'><RiNeteaseCloudMusicLine/>SMusic</div>
            <div className='login__form'>
                <div className='login__form--items'> 
                    <label htmlFor="username">
                        Email hoặc tên đăng nhập
                    </label>
                    <input type="text" className={errors && !userName ? 'input-error' : ''} name="username" id="username" placeholder='Email hoặc tên đăng nhập' value={userName} onChange={handleChangeUserName}/>
                </div>
                <div className='login__form--items'> 
                    <label htmlFor="password">
                        Mật khẩu
                    </label>
                    <input type="password" className={errors && !password ? 'input-error' : ''}  name="password" id="password" placeholder='Mật khẩu' value={password} onChange={handleChangePassword}/>
                </div>
                <div className='login__form--error'>
                    { errors }
                </div>
                <button onClick={login}>
                    Đăng nhập
                </button>
            </div>
            <div className='sign-up'>
                <p>
                    Chưa có tài khoản?
                </p>
                <NavLink to="/signup">
                    Đăng ký
                </NavLink>
            </div>
            <Loading />
        </div>
    );
}

export default Login;