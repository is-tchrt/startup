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
  const [list, setList] = React.useState(props.list);
  console.log("list: ", list);
  const navigate = useNavigate();

  // useEffect(() => {
  //     localStorage.setItem('list', JSON.stringify(list));
  //   }, [list]);

  useEffect(() => {
    const interval = setInterval(() => {
      let title = Math.floor(Math.random() * 2000);
      let description = "A descriptive description.";
      let author = "anon."
      const newItem = new listItem(title, description, author);
      fetch('api/list', {
        method: 'post',
        body: JSON.stringify({item: newItem}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((response) => response.json()).then((json) => setList(json.list));
      // setList((prevList) => [...prevList, newItem]);
      }, 10000);
      return () => clearInterval(interval);
  }, []);


  async function removeCompletedItem(itemId) {
    const response = await fetch('/api/list', {
      method: 'delete',
      body: JSON.stringify({itemId: itemId}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      console.log("working?");
      let json = await response.json();
      console.log("after removing: ", json.list);
      setList(json.list);
    }
    // const newList = list.slice(0, index).concat(list.slice(index + 1));
    // localStorage.setItem('list', JSON.stringify(newList));
    // setList(list.slice(0, index).concat(list.slice(index + 1)));
  }

  async function editItem(item) {
    // localStorage.setItem('currentItem', JSON.stringify(item));
    console.log("editItem item: ", item);
    props.setItem(item);
    navigate('/item');
  }
  
  return (
    <main className="list">
      <div>
        <div className="title">
          <h2>To-do:</h2>
          <button type="button" className='btn btn-secondary' onClick={() => editItem(null)}>Add an Item</button>
        </div>
        <form name="todo">
          {list.map((item) => (
            <DisplayItem item={item} removeCompletedItem={removeCompletedItem} editItem={editItem} key={item.id}/>
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
                {checked && (<button type="button" className='btn btn-primary' onClick={() => {setChecked(!checked); props.removeCompletedItem(props.item.id);}}>Mark as Completed?</button>)}
                <button type="button" className="btn btn-secondary" onClick={() => props.editItem(props.item)}>Edit</button>
              </div>
            </div>
  )
}
