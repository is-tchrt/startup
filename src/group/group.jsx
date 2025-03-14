import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Group(props) {
  const navigate = useNavigate();
  const [group, setGroup] = React.useState(props.group);

  async function getList() {
    const response = await fetch('/api/list', {
      method: 'get',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      const json = await response.json();
      return json.list;
    }
  }

  async function selectGroup() {
    const response = await fetch('/api/group', {
      method: 'put',
      body: JSON.stringify({group: group}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem("group", group);
      let list = await getList();
      props.setList(list);
      props.onGroupSelect(group);
      navigate("/list");
    }
  }

  return (
    <main>
      <h3>Please select your group:</h3>
      <div className="form-group">
        <div className="form-group">
          <input type="text" className="form-control" value={group} onChange={(e) => setGroup(e.target.value)} placeholder="GroupID" />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => selectGroup()} disabled={!group}>Continue</button>
      </div>
    </main>
  );
}
