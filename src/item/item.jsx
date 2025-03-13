import React from 'react';
import { useNavigate } from 'react-router-dom';
import { listItem } from '../list/listItem';
import './item.css';

export function Item(props) {
  // const selectedItemData = JSON.parse(localStorage.getItem('currentItem'));
  // const selectedItemIndex = selectedItemData.index;
  // const selectedItemData = props;
  if (props.item) {
  console.log("props item: ", props.item);
  } else {
    console.log("problem");
  }
  const author = props.item ? props.item.author : props.userName;
  console.log("author: ", author);
  const [title, setTitle] = React.useState(props.item ? props.item.title : "");
  const [description, setDescription] = React.useState(props.item ? props.item.description : "");
  const navigate = useNavigate();

  async function submitEdits(item) {
    console.log("props item: ", props.item);
      // const list = JSON.parse(localStorage.getItem('list'));
      // list[selectedItemIndex] = item;
      // localStorage.setItem('list', JSON.stringify(list));
      // navigate('/list');
    if (props.item) {
      item.id = props.item.id;
    }
      const list = await addItem(item);
      props.setList(list);
      props.setItem({});
      navigate('/list');
  }

  async function addItem(item) {
    const response = await fetch('/api/list', {
      method: props.item ? 'put' : 'post',
      body: JSON.stringify({item: item}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      const json = await response.json();
      return json.list;
    }
  }

  // async function editItem(item) {
  //   const response = await fetch('/api/list', {
  //     method: 'put',
  //     body: JSON.stringify({item: item}),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   });
  //   if (response?.status === 200) {
  //     const json = await response.json();
  //     return json.list;
  //   }
  // }

  const filler = "Lorem ipsum";

  return (
    <main className="item">
      <h2>Add a task:</h2>
      <div className='form-group'>
        <p className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" /></p>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder={filler} cols="40" rows="6"></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => submitEdits(new listItem(title, description, author))} disabled={!title}>Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/list')}>Cancel</button>
      </div>
    </main>
  );
}
