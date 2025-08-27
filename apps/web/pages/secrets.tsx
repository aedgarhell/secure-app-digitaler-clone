import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface Secret {
  id: number;
  type: string;
  tags?: string[];
  createdAt?: string;
}

/**
 * Secrets page lists all secrets accessible to the current user. Secrets
 * are decrypted on the backend before being sent to this page. In a
 * full implementation, users could view details or edit secrets here.
 */
const SecretsPage: React.FC = () => {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/secrets`);
        if (!res.ok) {
          throw new Error('Failed to fetch secrets');
        }
        const data: Secret[] = await res.json();
        setSecrets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSecrets();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Secrets</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">ID</th>
                <th className="border-b py-2">Type</th>
                <th className="border-b py-2">Tags</th>
                <th className="border-b py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {secrets.map((secret) => (
                <tr key={secret.id}>
                  <td className="py-2 border-b">{secret.id}</td>
                  <td className="py-2 border-b">{secret.type}</td>
                  <td className="py-2 border-b">
                    {secret.tags && secret.tags.length > 0 ? secret.tags.join(', ') : '—'}
                  </td>
                  <td className="py-2 border-b">
                    {secret.createdAt ? new Date(secret.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {secrets.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No secrets found.
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

export default SecretsPage;
