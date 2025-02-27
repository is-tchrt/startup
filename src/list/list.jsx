import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css';
import { listItem } from './listItem';

export function List(props) {
  const [list, setList] = React.useState(JSON.parse(localStorage.getItem('list')) || []);
  const [checkedValues, setCheckedValues] = React.useState(list.map(() => false));
  const navigate = useNavigate();

  // function listUpdates() {
  useEffect(() => {
    const interval = setInterval(() => {
      let title = Math.floor(Math.random() * 2000);
      let description = "A descriptive description.";
      let author = "anon."
      // props.setList(props.list.concat([{title: title, description: description, author: author}]));
      // let newList = list.concat([{title: title, description: description, author: author}])
      // setList(list.concat([{title: title, description: description, author: author}]));
      // props.setList(newList);
      const newItem = new listItem(title, description, author);
      setList((prevList) => [...prevList, newItem]);
      localStorage.setItem('list', JSON.stringify(list));
      // console.log("props: ", props.list);
      // props.setList(list);
      }, 10000);
      return () => clearInterval(interval);
  }, []);

  console.log(localStorage.getItem('list'));
  console.log(list);
  // listUpdates();

  function updateCheckedValues(changeIndex) {
    return checkedValues.map((item, index) => index === changeIndex ? !item : item)
    }

  function removeCompletedItem(index) {
    // props.setList(props.list.slice(0, index).concat(props.list.slice(index + 1)));
    const newList = list.slice(0, index).concat(list.slice(index + 1));
    localStorage.setItem('list', JSON.stringify(newList));
    setList(list.slice(0, index).concat(list.slice(index + 1)));
    // setList(newList);
    // console.log("Remove prop: ", props.list);
    console.log("Remove list: ", list);
    // console.log(list);
    // props.setList(list);
    // setCheckedValues(checkedValues.slice(0, index).concat(checkedValues.slice(index + 1)));
  }

  async function editItem(item) {
    localStorage.setItem('currentItem', JSON.stringify(item));
    props.setList(list);
    props.setCurrentItem(item);
    navigate('/item');
  }
  
  return (
    <main className="list">
      <div>
        <h2>To-do:</h2>
        <form name="todo">
          {list.map((item, index) => (
            <DisplayItem item={item} index={index} removeCompletedItem={removeCompletedItem} editItem={editItem} />
            // <div className="todo">
            //   <div className="itemData">
            //     <input type="checkbox" checked={checkedValues[index]} onChange={() => {setCheckedValues(updateCheckedValues(index))}}/>
            //     <span>{item.title}</span>
            //     <span>-- Added by {item.author}</span><br/>
            //   </div>
            //   <div>
            //     {checkedValues[index] && (<button type="submit" className='btn btn-primary' onClick={() => removeCompletedItem(index)}>Mark as Completed?</button>)}
            //     <button type="submit" className="btn btn-secondary" onClick={() => editItem({item: item, index: index})}>Edit</button>
            //     {// <button type="submit" className="btn btn-secondary" onClick={() => navigate("/item", {state: {item: item, setList: setList}})}>Edit</button>
            //     }
            //   </div>
            // </div>
          )
          )
        }
        </form>
      </div>
    </main>
  );
}

function DisplayItem(props) {
  const [checked, setChecked] = React.useState(false);

  return (
            <div className="todo">
              <div className="itemData">
                <input type="checkbox" checked={checked} onChange={() => {setChecked(!checked)}}/>
                <span>{props.item.title}</span>
                <span>-- Added by {props.item.author}</span><br/>
              </div>
              <div>
                {checked && (<button type="submit" className='btn btn-primary' onClick={() => props.removeCompletedItem(props.index)}>Mark as Completed?</button>)}
                <button type="submit" className="btn btn-secondary" onClick={() => props.editItem({item: props.item, index: props.index})}>Edit</button>
                {// <button type="submit" className="btn btn-secondary" onClick={() => navigate("/item", {state: {item: item, setList: setList}})}>Edit</button>
                }
              </div>
            </div>
  )
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
