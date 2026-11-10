import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Groups from "./Group";
import CreateGroups from "./CreateGroups";
import GroupDetails from "./GroupDetails";
import { useAuth } from "./AuthContext";
import { apiFetch } from "./api";

function App() {
  const [groups, setGroups] = useState([]);
  const { user, logout } = useAuth();

  const fetchGroups = () => {
    if (!user) return;
    apiFetch("/groups")
      .then((response) => response.json())
      .then((data) => setGroups(data));
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  if (!user) {
    return (
      <div>
        <header className="app-header">
          <h1>Splitwise</h1>
        </header>
        <main className="container">
          <Login />
        </main>
      </div>
    );
  }

  return (
    <div>
      <header className="app-header">
        <h1>Splitwise</h1>
        <div>
          <span>{user.name} </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Groups groups={groups} />
                <CreateGroups onGroupCreated={fetchGroups} />
              </>
            }
          />
          <Route path="/groups/:id" element={<GroupDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;