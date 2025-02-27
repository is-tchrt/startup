import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');

  async function login() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
    navigate("/group");
  }

  async function register() {
    localStorage.setItem('userName', userName);
    navigate("/group");
  }
  
  return (
    <main>
      <h2>Welcome to OneList!</h2>
      <form>
        <div className="form-group">
          <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary" onClick={() => login()} disabled={!userName || !password}>Login</button>
        <button type="submit" className="btn btn-secondary" onClick={() => register()} disabled={!userName || !password}>Register</button>
      </form>
    </main>
  );
}
