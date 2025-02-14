import React from 'react';
import './list.css';

export function List() {
  return (
    <main className="list">
      <div>
        <h2>To-do:</h2>
        <form name="todo">
          <div className="todo">
            <input type="checkbox" />
            <label>Finish HTML</label>
            <span>-- Added by Isaac</span><br></br>
          </div>
          <div className="todo">
            <input type="checkbox" />
            <label>Add CSS</label>
            <span>-- Added by Isaac</span><br></br>
          </div>
        </form>
      </div>
    </main>
  );
}
