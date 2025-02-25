import React from 'react';
import './list.css';

export function List() {
  const [list, setList] = localStorage.getItem('list') ?
    React.useState(JSON.parse(localStorage.getItem('list'))) :
    React.useState([]);
  const [checkedValues, setCheckedValues] = React.useState(list.map(() => false));

  // function formatList(todoList) {
  //   let listItems = [];
  //   for (item of todoList) {
  //     listItems.push(
  //       <div className="todo">
  //         <input type="checkbox" />
  //         <label>{item.title}</label>
  //         <span>-- Added by {item.author}</span><br/>
  //       </div>
  //     );
  //   }
  //   return listItems;
  // }

  function listUpdates() {
    setInterval(() => {
      let title = Math.floor(Math.random() * 2000);
      let author = "anon."
      setList(list.concat([{title: title, author: author}]));
      localStorage.setItem('list', JSON.stringify(list));
      }, 60000)
  }

  listUpdates();

  function updateCheckedValues(changeIndex) {
    return checkedValues.map((item, index) => index === changeIndex ? !item : item)
    }
  
  return (
    <main className="list">
      <div>
        <h2>To-do:</h2>
        <form name="todo">
          {list.map((item, index) => (
            <div className="todo">
              <input type="checkbox" onChange={() => {setCheckedValues(updateCheckedValues(index))}}/>
              <label>{item.title}</label>
              <span>-- Added by {item.author}</span><br/>
              {checkedValues[index] && (<button type="submit" className='btn btn-primary'>Mark as Completed?</button>)}
              <button type="submit" className="btn btn-secondary">Edit</button>
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
