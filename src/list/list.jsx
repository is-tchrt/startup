import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './list.css';
import { listItem } from './listItem';

async function getList() {
  const response = await fetch('/api/list', {
    method: 'get',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  if (response?.status === 200) {
    return response.body.list;
  } else {
    return ['duck'];
  }
}

export function List(props) {
  const [list, setList] = React.useState([props.list]);
  console.log(props.list);
  const navigate = useNavigate();

  useEffect(() => {
      localStorage.setItem('list', JSON.stringify(list));
    }, [list]);

  useEffect(() => {
    const interval = setInterval(() => {
      let title = Math.floor(Math.random() * 2000);
      let description = "A descriptive description.";
      let author = "anon."
      const newItem = new listItem(title, description, author);
      setList((prevList) => [...prevList, newItem]);
      }, 10000);
      return () => clearInterval(interval);
  }, []);


  function removeCompletedItem(index) {
    const newList = list.slice(0, index).concat(list.slice(index + 1));
    localStorage.setItem('list', JSON.stringify(newList));
    setList(list.slice(0, index).concat(list.slice(index + 1)));
  }

  async function editItem(item) {
    localStorage.setItem('currentItem', JSON.stringify(item));
    navigate('/item');
  }
  
  return (
    <main className="list">
      <div>
        <div className="title">
          <h2>To-do:</h2>
          <button type="submit" className='btn btn-secondary' onClick={() => editItem({item: new listItem("", "", props.userName), index: list.length})}>Add an Item</button>
        </div>
        <form name="todo">
          {list.map((item, index) => (
            <DisplayItem item={item} index={index} removeCompletedItem={removeCompletedItem} editItem={editItem} key={index}/>
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
              </div>
            </div>
  )
}
