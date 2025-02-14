import React from 'react';
// import '../app';

export function Login() {
  return (
    <main>
      <h2>Welcome to OneList!</h2>
      <form>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Username" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <button type="submit" className="btn btn-secondary">Register</button>
      </form>
    </main>
  );
}
