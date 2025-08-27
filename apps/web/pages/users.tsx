import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface User {
  id: number;
  name?: string;
  email: string;
  createdAt?: string;
}

/**
 * Users page lists all users within the current tenant. In a complete
 * application, this page would allow administrators to manage user roles
 * and invitations.
 */
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/users`);
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">ID</th>
                <th className="border-b py-2">Email</th>
                <th className="border-b py-2">Name</th>
                <th className="border-b py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 border-b">{user.id}</td>
                  <td className="py-2 border-b">{user.email}</td>
                  <td className="py-2 border-b">{user.name || '—'}</td>
                  <td className="py-2 border-b">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default UsersPage;
