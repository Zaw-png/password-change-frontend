import { useState } from "react";
import "./App.css";

const API = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin12345");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");

  async function login(e) {
    e.preventDefault();

    const response = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setUser(data.user);

    await loadItems();

    if (data.user.role === "admin") {
      await loadUsers();
    }
  }

  async function loadItems() {
    const response = await fetch(`${API}/api/item`, {
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setItems(data.items);
  }

  async function createItem(e) {
    e.preventDefault();

    const response = await fetch(`${API}/api/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: itemName,
      }),
    });

    if (response.ok) {
      setItemName("");
      await loadItems();
    }
  }

  async function loadUsers() {
    const response = await fetch(`${API}/api/user`, {
      credentials: "include",
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setUsers(data.users);
  }

  async function changePassword(e) {
    e.preventDefault();

    const response = await fetch(
      `${API}/api/user/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: selectedUser,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      setNewPassword("");
    }
  }

  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>

        <form onSubmit={login}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Item Management</h1>

      <p>
        Logged in as <b>{user.username}</b>
      </p>
<button
  onClick={() => {
    setUser(null);
    setItems([]);
    setUsers([]);
  }}
>
  Logout
</button>
      <form onSubmit={createItem}>
        <input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item name"
        />

        <button type="submit">Add Item</button>
      </form>

      <h2>Items</h2>

      {items.length === 0 ? (
        <p>No items</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {user.role === "admin" && (
        <div className="admin">
          <h2>User Management</h2>

          <p>Admin only</p>

          <form onSubmit={changePassword}>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Select user</option>

              {users.map((u) => (
                <option key={u._id} value={u.username}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
            />

            <button type="submit">
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
