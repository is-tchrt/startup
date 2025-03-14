import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listItem } from '../list/listItem';
import './item.css';

export function Item(props) {
  const author = props.item ? props.item.author : props.userName;
  const [title, setTitle] = React.useState(props.item ? props.item.title : "");
  const [description, setDescription] = React.useState(props.item ? props.item.description : "");
  const [quote, setQuote] = React.useState("loading...");
  const navigate = useNavigate();

  async function submitEdits(item) {
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

  useEffect (() => {
    fetch('https://quote.cs260.click/')
    .then(response => response.json())
    .then(data => setQuote(data.quote));
  }, []);

  return (
    <main className="item">
      <h2>Add a task:</h2>
      <div className='form-group'>
        <p className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" /></p>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder={quote} cols="40" rows="6"></textarea>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => submitEdits(new listItem(title, description, author))} disabled={!title}>Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/list')}>Cancel</button>
      </div>
    </main>
  );
}
