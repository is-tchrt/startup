import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return <div className="body bg-dark text-light">
    <header>
      <nav className="navbar navbar-light navbar-expand-lg">
        <a href="#"><img src="checklist.png" height="50" align="left"/></a>
        <ul className="navbar-nav">
          <li className="nav-item"><a href="index.html" className="nav-link">Login</a></li>
          <li className="nav-item"><a href="group.html" className="nav-link">Group Selection</a></li>
          <li className="nav-item"><a href="list.html" className="nav-link">List</a></li>
          <li className="nav-item"><a href="item.html" className="nav-link">Edit Items</a></li>
        </ul>
      </nav>
    </header>
    <main>App components go here</main>
    <footer>
      <span>Isaac Teichert</span>
      <a href="https://github.com/is-tchrt/startup">Github</a>
    </footer>
    </div>;
}
