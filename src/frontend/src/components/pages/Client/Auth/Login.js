import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you have a CSS file for styles
import axios from 'axios';
import { message } from 'antd';
import Cookies from 'js-cookie';

const Login = () => {
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('accessTokenStudent');
    if (token) {
      navigate('/dashboard', { state: { studentCode } });
    }
  }, [navigate, studentCode]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/student-login`, {
        studentCode,
        password,
      });
      console.log("login", response.data);
      if (response.status === 200) {
        message.success('Đăng nhập thành công!');
        Cookies.set('accessTokenStudent', response.data.accessTokenStudent, { expires: 1 / 48 });
        navigate('/dashboard', { state: { studentCode } });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error('Mã sinh viên hoặc mật khẩu không đúng.');
      } else {
        message.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <div className="screen__content">
          <form className="login" onSubmit={handleLogin}>
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                type="text"
                className="login__input"
                placeholder="User name / Email"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
              />
            </div>
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                type="password"
                className="login__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="button login__submit" type="submit">
              <span className="button__text">Log In Now</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
          <div className="social-login">
            <div className="social-icons">
              <a href="#" className="social-login__icon fab fa-instagram"></a>
              <a href="#" className="social-login__icon fab fa-facebook"></a>
              <a href="#" className="social-login__icon fab fa-twitter"></a>
            </div>
          </div>
        </div>
        <div className="screen__background">
          <span className="screen__background__shape screen__background__shape4"></span>
          <span className="screen__background__shape screen__background__shape3"></span>
          <span className="screen__background__shape screen__background__shape2"></span>
          <span className="screen__background__shape screen__background__shape1"></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
