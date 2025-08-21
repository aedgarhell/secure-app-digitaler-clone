import React, { useState, useEffect } from 'react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenantId');
    try {
      const res = await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          email,
          password,
          role,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error creating user: ${text || res.status}`);
      }
      setEmail('');
      setPassword('');
      setRole('customer');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleCreateUser} className="mb-4">
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 flex-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="border p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">customer</option>
            <option value="admin">admin</option>
          </select>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2">
            Create User
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li key={user.id} className="border p-2 flex justify-between items-center">
            <span>
              {user.email} ({user.role})
            </span>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
