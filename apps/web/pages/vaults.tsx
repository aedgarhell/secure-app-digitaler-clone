import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface Vault {
  id: number;
  name?: string;
  createdAt?: string;
}

/**
 * Vaults page lists all vaults for the current tenant. Users can view
 * basic details about each vault. In the future, actions like
 * creating or managing vaults could be added here.
 */
const VaultsPage: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/vaults`);
        if (!res.ok) {
          throw new Error('Failed to fetch vaults');
        }
        const data: Vault[] = await res.json();
        setVaults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVaults();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Vaults</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2">ID</th>
                <th className="border-b py-2">Name</th>
                <th className="border-b py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {vaults.map((vault) => (
                <tr key={vault.id}>
                  <td className="py-2 border-b">{vault.id}</td>
                  <td className="py-2 border-b">{vault.name || vault.id}</td>
                  <td className="py-2 border-b">
                    {vault.createdAt ? new Date(vault.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {vaults.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No vaults found.
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

export default VaultsPage;
