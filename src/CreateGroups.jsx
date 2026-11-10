import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "./api";

function CreateGroups({ onGroupCreated }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    apiFetch("/users")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      });
  }, []);

  const toggleMember = (memberId) => {
    setSelected((prev) =>
      prev.includes(memberId)
        ? prev.filter((m) => m !== memberId)
        : [...prev, memberId],
    );
  };

  const handleCreate = () => {
    if (!name) {
      alert("Enter a group name");
      return;
    }
    apiFetch("/groups", {
      method: "POST",
      body: JSON.stringify({ name, members: selected }),
    })
      .then((response) => response.json())
      .then(() => {
        setName("");
        setSelected([]);
        onGroupCreated();
      });
  };

  return (
    <div className="card">
      <h2>Create Group</h2>
      <div className="form">
        <div className="field">
          <label htmlFor="groupName">Group name</label>
          <input
            id="groupName"
            type="text"
            placeholder="e.g. Goa Trip"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Select members</label>
          {users
            .filter((u) => u._id !== user.id)
            .map((u) => (
              <label key={u._id} className="member-option">
                <input
                  type="checkbox"
                  checked={selected.includes(u._id)}
                  onChange={() => toggleMember(u._id)}
                />
                {u.name} <span className="muted">({u.email})</span>
              </label>
            ))}
        </div>

        <button onClick={handleCreate}>Create Group</button>
      </div>
    </div>
  );
}

export default CreateGroups;