import React from 'react';
import { useNavigate } from 'react-router-dom';
import { listItem } from '../list/listItem';
import './item.css';

export function Item(props) {
  // const selectedItemData = JSON.parse(localStorage.getItem('currentItem'));
  // const selectedItemIndex = selectedItemData.index;
  // const selectedItemData = props;
  const author = props.item ? props.item.author : props.userName;
  const [title, setTitle] = React.useState(props.item ? props.item.title : "");
  const [description, setDescription] = React.useState(props.item ? props.item.description : "");
  const navigate = useNavigate();

  async function submitEdits(item) {
    console.log("props item: ", props.item);
    if (props.item) {
      console.log("wrong if statement");
      // const list = JSON.parse(localStorage.getItem('list'));
      // list[selectedItemIndex] = item;
      // localStorage.setItem('list', JSON.stringify(list));
      // navigate('/list');
    } else {
      const list = await addItem(item);
      props.setList(list);
      props.setItem({});
      navigate('/list');
    }
  }

  async function addItem(item) {
    const response = await fetch('/api/list', {
      method: 'post',
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

  const filler = "Lorem ipsum";

  return (
    <main className="item">
      <h2>Add a task:</h2>
      <form>
        <p className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" /></p>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder={filler} cols="40" rows="6"></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => submitEdits(new listItem(title, description, author))} disabled={!title}>Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/list')}>Cancel</button>
      </form>
    </main>
  );
}
