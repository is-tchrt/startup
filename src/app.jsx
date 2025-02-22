import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Group } from './group/group';
import { List } from './list/list';
import { Item } from './item/item';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [group, setGroup] = React.useState('');
  
  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <nav className="navbar navbar-light navbar-expand-lg">
            <NavLink to=""><img src="checklist.png" height="50" align="left"/></NavLink>
            <ul className="navbar-nav">
              {!loggedIn && (<li className="nav-item"><NavLink to="" className="nav-link">Login</NavLink></li>)}
              {loggedIn && (<li className="nav-item"><NavLink to="group" className="nav-link">Group Selection</NavLink></li>)}
              {loggedIn && group && (<li className="nav-item"><NavLink to="list" className="nav-link">List</NavLink></li>)}
              {loggedIn && group && (<li className="nav-item"><NavLink to="item" className="nav-link">Edit Items</NavLink></li>)}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login userName={userName} onLogin={(userName) => {setUserName(userName)}} />} exact />
          <Route path='/group' element={loggedIn ? <Group /> : <NotAllowed />} />
          <Route path='/list' element={loggedIn ? <List /> : <NotAllowed />} />
          <Route path='/item' element={loggedIn ? <Item /> : <NotAllowed />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
          <hr></hr>
          <span>Isaac Teichert</span>
          <a href="https://github.com/is-tchrt/startup">Github</a>
        </footer>
      </div>
    </BrowserRouter>
    );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Not Found</main>;
}

function NotAllowed() {
  return <main className="container-fluid bg-secondary text-center">Please login to access this page.</main>;
}
