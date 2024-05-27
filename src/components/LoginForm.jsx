// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/LoginForm.css';
import logo from '../images/sport-agency.png';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, child, get } from 'firebase/database';
import { app } from '../Firebase/Firebase';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const db = getDatabase(app);
        const initialValuesRef = ref(db, 'initialValues');
        const snapshot = await get(child(initialValuesRef, 'login'));
        if (snapshot.exists()) {
          const initialValues = snapshot.val();
          setEmail(initialValues.email);
          setPassword(initialValues.password);
        }
      } catch (error) {
        console.error('初期値の取得エラー:', error);
      }
    };
    fetchInitialValues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const db = getDatabase(app);
      const loginRef = ref(db, 'login');
      const snapshot = await get(loginRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const user = Object.values(users).find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          console.log('ログイン成功');
          navigate('Dashboard');
        } else {
          setErrorMessage('メールアドレスまたはパスワードが正しくありません。');
        }
      } else {
        setErrorMessage('ユーザーが存在しません。メールアドレスを確認してください。');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return (
    <div className="login-form-container">
      <div className="logo-container">
        <img src={logo} alt="スポーツ庁" className="logo" />
      </div>
      <div className="login-form">
        <div className="form-container">
          <div className="form-wrapper">
            <h2>SIGN IN</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p className="forgot-password">
              Forgot your <a href="#">password</a>?
            </p>
            <p className="create-account">
              <Link to="/create-account">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;