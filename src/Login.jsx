import { useState } from "react";
import { useAuth } from "./AuthContext";

const API = "https://splitwise-application-iwx7.onrender.com/api/auth";

function Login() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const send = (path, body) =>
    fetch(`${API}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (mode === "signup") {
        const res = await send("signup", { name, email, password });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          return;
        }
      }

      const res = await send("login", { email, password });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      login(data.user, data.token);
    } catch {
      setError("Could not reach the server. It may be waking up, try again in a minute.");
    }
  };

  return (
    <div className="card">
      <h2>{mode === "login" ? "Login" : "Create account"}</h2>
      <div className="form">
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleSubmit}>
          {mode === "login" ? "Login" : "Sign up"}
        </button>

        <p className="muted">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button
            className="link-button"
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "signup" : "login");
            }}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;