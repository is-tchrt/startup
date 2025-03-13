import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function Login(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');

  async function login() {
    // localStorage.setItem('userName', userName);
    // props.onLogin(userName);
    loginOrRegister('/api/login');
  }

  async function register() {
    localStorage.setItem('userName', userName);
    loginOrRegister('/api/create');
    // navigate("/group");
  }

  async function loginOrRegister(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({username: userName, password: password}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
      navigate("/group");
    }
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
        <Button variant="btn btn-primary" onClick={() => login()} disabled={!userName || !password}>Login</Button>
        <button type="button" className="btn btn-secondary" onClick={() => register()} disabled={!userName || !password}>Register</button>
      </form>
    </main>
  );
}
