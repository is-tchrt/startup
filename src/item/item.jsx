import React from 'react';
import './item.css';

export function Item(props) {
  const [title, setTitle] = React.useState(props.item.title);
  const [description, setDescription] = React.useState(props.item.description);
  console.log(props);

  return (
    <main className="item">
      <h2>Add a task:</h2>
      <form>
        <p className="form-group"><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" /></p>
        <div className="form-group">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="Lorem ipsum" cols="40" rows="6"></textarea>
        </div>
        <button type="submit" className="btn btn-primary" onClick={() => login()} disabled={!title}>Submit</button>
      </form>
    </main>
  );
}
