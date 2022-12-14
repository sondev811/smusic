import React, { useState } from 'react';
import { RiNeteaseCloudMusicLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import { useAppDispatch } from '../../hooks';
import { authService } from '../../services/auth.service';
import '../Login/Login.scss';

function ResetPassword() {

  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [buttonTitle, setButtonTitle] = useState(`Reset password`);
  const navigate = useNavigate();

  const resetPassword = async (event) => {
    try {
      event.preventDefault();
      if (!email) return;
      const body = {email: email.trim().toLowerCase()};
      setProcessing(true);
      setButtonTitle(`Đang đổi mật khẩu...`);
      const res = await authService.resetPassword(body);
      if (!res || !res.result || !res.result.success) {
        setTimeout(() => {
          setProcessing(false);
          toast.error('Không thể reset password. Thử lại sau!!!');
          setButtonTitle(`Reset password`);
        }, 1000);
        return;
      }
      setTimeout(() => {
        setProcessing(false);
        toast.success(`Đổi mật khẩu thành công cho tài khoản ${res.result.email}. Chúng tôi đã gửi mật khẩu mới vào hòm thư. Kiểm tra mục thư rác nếu không tìm thấy mail`);
        setButtonTitle(`Đang chuyển tới trang đăng nhập...`);
        setTimeout(() => {
          return navigate('/login');
        }, 6000);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setProcessing(false);
        toast.error('Không thể reset password. Thử lại sau!!!');
        setButtonTitle(`Reset password`);
      }, 1000);
    }
  }

  return (
    <>
      <div className="login">
        <div className="login__logo">
          <RiNeteaseCloudMusicLine />
          SMusic
        </div>
        <div className="login__form">
            <form onSubmit={resetPassword}>
              <div className="login__form--items">
                <label htmlFor="username">Email</label>
                <input
                  data-testid="username"
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Email reset password"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className={processing ? `disabled` : null}>{buttonTitle}</button>
            </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default ResetPassword;