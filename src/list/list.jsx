import React from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css';

export function List(props) {
  const [list, setList] = localStorage.getItem('list') ?
    React.useState(JSON.parse(localStorage.getItem('list'))) :
    React.useState([]);
  const [checkedValues, setCheckedValues] = React.useState(list.map(() => false));
  const navigate = useNavigate();

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
      let description = "A descriptive description.";
      let author = "anon."
      setList(list.concat([{title: title, description: description, author: author}]));
      localStorage.setItem('list', JSON.stringify(list));
      }, 10000)
  }

  listUpdates();

  function updateCheckedValues(changeIndex) {
    return checkedValues.map((item, index) => index === changeIndex ? !item : item)
    }

  function removeCompletedItem(index) {
    setList(list.slice(0, index).concat(list.slice(index + 1)));
    setCheckedValues(checkedValues.slice(0, index).concat(checkedValues.slice(index + 1)));
  }

  async function editItem(item) {
    localStorage.setItem('currentItem', JSON.stringify(item));
    props.setCurrentItem(item);
    navigate('/item');
  }
  
  return (
    <main className="list">
      <div>
        <h2>To-do:</h2>
        <form name="todo">
          {list.map((item, index) => (
            <div className="todo">
              <div className="itemData">
                <input type="checkbox" checked={checkedValues[index]} onChange={() => {setCheckedValues(updateCheckedValues(index))}}/>
                <span>{item.title}</span>
                <span>-- Added by {item.author}</span><br/>
              </div>
              <button type="submit" className="btn btn-secondary" onClick={() => editItem(item)}>Edit</button>
              {// <button type="submit" className="btn btn-secondary" onClick={() => navigate("/item", {state: {item: item, setList: setList}})}>Edit</button>
              }
              {checkedValues[index] && (<button type="submit" className='btn btn-primary' onClick={() => removeCompletedItem(index)}>Mark as Completed?</button>)}
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
