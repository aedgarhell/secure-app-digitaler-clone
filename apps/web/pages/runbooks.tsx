import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface Runbook {
  id: number;
  title: string;
  content?: string;
  tags?: string[];
  createdAt?: string;
}

/**
 * Runbooks page displays a list of runbooks associated with the current tenant.
 * In a full implementation, users could create, edit, and delete runbooks.
 */
const RunbooksPage: React.FC = () => {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRunbooks = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/runbooks`);
        if (!res.ok) {
          throw new Error('Failed to fetch runbooks');
        }
        const data: Runbook[] = await res.json();
        setRunbooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRunbooks();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Runbooks</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">ID</th>
                <th className="border-b py-2">Title</th>
                <th className="border-b py-2">Tags</th>
                <th className="border-b py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {runbooks.map((runbook) => (
                <tr key={runbook.id}>
                  <td className="py-2 border-b">{runbook.id}</td>
                  <td className="py-2 border-b">{runbook.title}</td>
                  <td className="py-2 border-b">
                    {runbook.tags && runbook.tags.length > 0
                      ? runbook.tags.join(', ')
                      : '—'}
                  </td>
                  <td className="py-2 border-b">
                    {runbook.createdAt
                      ? new Date(runbook.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
              {runbooks.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No runbooks found.
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

export default RunbooksPage;
