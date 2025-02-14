import React from 'react';
import './item.css';

export function Item() {
  return (
    <main className="item">
      <h2>Add a task:</h2>
      <form>
        <p class="form-group"><input type="text" class="form-control" placeholder="Title" /></p>
        <div class="form-group">
          <textarea class="form-control" placeholder="Lorem ipsum" cols="40" rows="6"></textarea>
        </div>
      </form>
    </main>
  );
}
