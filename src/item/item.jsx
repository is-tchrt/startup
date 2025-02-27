import React from 'react';
import { useNavigate } from 'react-router-dom';
import './item.css';

export function Item(props) {
  const item = props.itemData.item;
  const selectedItemIndex = props.itemData.index;
  const [title, setTitle] = React.useState(props.itemData.item.title);
  const [description, setDescription] = React.useState(props.itemData.item.description);
  const navigate = useNavigate();
  console.log(props);

  function submitEdits(item) {
    props.setList(props.list.map((element, index) => index === selectedItemIndex ? item : element));
    props.setCurrentItem({item: item, index: selectedItemIndex});
    localStorage.setItem('list', JSON.stringify(props.list));
    localStorage.setItem('currentItem', JSON.stringify({item: item, index: selectedItemIndex}));
    navigate('/list');
  }

  return (
    <main className="item">
      <h2>Add a task:</h2>
      <form>
        <p className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" /></p>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Lorem ipsum" cols="40" rows="6"></textarea>
        </div>
        <button type="submit" className="btn btn-primary" onClick={() => submitEdits({title: title, description: description, author: props.userName})} disabled={!title}>Submit</button>
      </form>
    </main>
  );
}
