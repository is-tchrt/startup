import React from 'react';
import { ListGroupItem } from 'react-bootstrap';
import './list.css';

export function List() {
  const [list, setList] = React.useState(localStorage.getItem('list') || []);

  function formatList(todoList) {
    let listItems = [];
    for (item of todoList) {
      listItems.push(
        <div className="todo">
          <input type="checkbox" />
          <label>{item.title}</label>
          <span>-- Added by {item.author}</span><br/>
        </div>
      );
    }
    return listItems;
  }
  
  return (
    <main className="list">
      <div>
        <h2>To-do:</h2>
        <form name="todo">
          {list.map((item) => (
            <div className="todo">
              <input type="checkbox" />
              <label>{item.title}</label>
              <span>-- Added by {item.author}</span><br/>
            </div>
          ))}
        </form>
      </div>
    </main>
  );
}
          // <div className="todo">
          //   <input type="checkbox" />
          //   <label>Finish HTML</label>
          //   <span>-- Added by Isaac</span><br></br>
          // </div>
          // <div className="todo">
          //   <input type="checkbox" />
          //   <label>Add CSS</label>
          //   <span>-- Added by Isaac</span><br></br>
          // </div>
