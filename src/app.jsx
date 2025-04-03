import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Group } from './group/group';
import { List } from './list/list';
import { Item } from './item/item';

export default function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentLoginState = userName ? true : false;
  const [loggedIn, setLoggedIn] = React.useState(currentLoginState);
  const [group, setGroup] = React.useState(localStorage.getItem('group') || '');
  const [list, setList] = React.useState(() => []);
  const [item, setItem] = React.useState(() => {});
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  const socket = new WebSocket(`${protocol}://${window.location.host}`);

  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <nav className="navbar navbar-light navbar-expand-lg">
            <NavLink to=""><img src="checklist.png" height="50" align="left"/></NavLink>
            <ul className="navbar-nav">
              {loggedIn && (<li className="nav-item"><NavLink to="group" className="nav-link">Group Selection</NavLink></li>)}
              {loggedIn && group && (<li className="nav-item"><NavLink to="list" className="nav-link">List</NavLink></li>)}
              {!loggedIn && (<li className="nav-item"><NavLink to="" className="nav-link">Login</NavLink></li>)}
              {loggedIn && (<li className='nav-item'><NavLink to="logout" className="nav-link">Logout</NavLink></li>)}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login userName={userName} onLogin={(userName) => {
              setUserName(userName);
              setLoggedIn(true);
          }} />} exact />
          <Route path='/group' element={loggedIn ? <Group group={group} onGroupSelect={(group) => {setGroup(group)}} setList={(newList) => {setList(newList);}} /> : <NotAllowed />} />
          <Route path='/list' element={loggedIn ? <List list={list} userName={userName} setItem={(newItem) => {setItem(newItem)}} socket={socket} /> : <NotAllowed />} />
          <Route path='/item' element={loggedIn ? <Item item={item} setItem={(newItem) => {setItem(newItem)}} setList={(newList) => {setList(newList)}} userName={userName} /> : <NotAllowed />} />
          <Route path='/logout' element={<Logout logout={() => setLoggedIn(false)} />} />
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

function Logout(props) {
  const navigate = useNavigate();
  fetch('/api/logout', {
    method: 'delete',
  }).catch(() => {}).finally(() => {
    localStorage.clear();
    props.logout();
  });
  navigate('/');
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Not Found</main>;
}

function NotAllowed() {
  return <main className="container-fluid bg-secondary text-center">Please login to access this page.</main>;
}
