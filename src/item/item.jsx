import React from 'react';
import { useNavigate } from 'react-router-dom';
import { listItem } from '../list/listItem';
import './item.css';

export function Item() {
  const selectedItemData = JSON.parse(localStorage.getItem('currentItem'));
  const selectedItemIndex = selectedItemData.index;
  const author = selectedItemData.item.author;
  const [title, setTitle] = React.useState(selectedItemData.item.title);
  const [description, setDescription] = React.useState(selectedItemData.item.description);
  const navigate = useNavigate();

  function submitEdits(item) {
    const list = JSON.parse(localStorage.getItem('list'));
    list[selectedItemIndex] = item;
    localStorage.setItem('list', JSON.stringify(list));
    navigate('/list');
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
        <button type="submit" className="btn btn-primary" onClick={() => submitEdits(new listItem(title, description, author))} disabled={!title}>Submit</button>
        <button type="submit" className="btn btn-secondary" onClick={() => navigate('/list')}>Cancel</button>
      </form>
    </main>
  );
}
