import React from 'react';
import { useNavigate } from 'react-router-dom';
import { listItem } from '../list/listItem';
import './item.css';

export function Item(props) {
  // const item = props.itemData.item;
  const selectedItemData = JSON.parse(localStorage.getItem('currentItem'));
  // const selectedItemIndex = props.itemData.index;
  const selectedItemIndex = selectedItemData.index;
  const author = selectedItemData.item.author;
  const [title, setTitle] = React.useState(props.itemData.item.title);
  const [description, setDescription] = React.useState(props.itemData.item.description);
  const navigate = useNavigate();
  console.log(selectedItemData);

  function submitEdits(item) {
    // props.setList(props.list.map((element, index) => index === selectedItemIndex ? item : element));
    // props.setCurrentItem({item: item, index: selectedItemIndex});
    const list = JSON.parse(localStorage.getItem('list'));
    list[selectedItemIndex] = item;
    localStorage.setItem('list', JSON.stringify(list));
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
        <button type="submit" className="btn btn-primary" onClick={() => submitEdits(new listItem(title, description, author))} disabled={!title}>Submit</button>
      </form>
    </main>
  );
}
