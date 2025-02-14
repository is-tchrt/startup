import React from 'react';

export function Group() {
  return (
    <main>
      <h3>Please select your group:</h3>
      <form>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="GroupID" />
        </div>
        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </main>
  );
}
