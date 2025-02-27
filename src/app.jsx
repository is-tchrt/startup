import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Group } from './group/group';
import { List } from './list/list';
import { Item } from './item/item';

export default function App() {
  console.log("refreshed app");
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentLoginState = userName ? true : false;
  const [loggedIn, setLoggedIn] = React.useState(currentLoginState);
  const [list, setList] = React.useState(JSON.parse(localStorage.getItem('list')) || [])
  const [group, setGroup] = React.useState(localStorage.getItem('group') || '');
  const [currentItem, setCurrentItem] = React.useState(JSON.parse(localStorage.getItem('currentItem')) || {item: {title: "", description: "", author: ""}});

  // const list = JSON.parse(localStorage.getItem('list')) || [];
  
  return (
    <BrowserRouter>
      <div className="body">
        <header>
          <nav className="navbar navbar-light navbar-expand-lg">
            <NavLink to=""><img src="checklist.png" height="50" align="left"/></NavLink>
            <ul className="navbar-nav">
              {loggedIn && (<li className="nav-item"><NavLink to="group" className="nav-link">Group Selection</NavLink></li>)}
              {loggedIn && group && (<li className="nav-item"><NavLink to="list" className="nav-link">List</NavLink></li>)}
              {loggedIn && group && (<li className="nav-item"><NavLink to="item" className="nav-link">Edit Items</NavLink></li>)}
              {!loggedIn ? (<li className="nav-item"><NavLink to="" className="nav-link">Login</NavLink></li>) : (<li className='nav-item'><NavLink to="" className="nav-link">Logout</NavLink></li>)}
            </ul>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={loggedIn ? <Logout logout={() => setLoggedIn(false)}/> : <Login userName={userName} onLogin={(userName) => {setUserName(userName)}} />} exact />
          <Route path='/group' element={loggedIn ? <Group group={group} onGroupSelect={(group) => {setGroup(group)}} /> : <NotAllowed />} />
          <Route path='/list' element={loggedIn ? <List list={list} setList={(list) => setList(list)} setCurrentItem={(item) => setCurrentItem(item)} /> : <NotAllowed />} />
          <Route path='/item' element={loggedIn ? <Item itemData={currentItem} list={list} userName={userName} setList={setList} setCurrentItem={setCurrentItem}/> : <NotAllowed />} />
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
  localStorage.clear();
  props.logout();
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Not Found</main>;
}

function NotAllowed() {
  return <main className="container-fluid bg-secondary text-center">Please login to access this page.</main>;
}
