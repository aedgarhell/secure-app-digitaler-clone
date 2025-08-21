import React, { useEffect, useState } from 'react';

interface Vault {
  id: number;
  name?: string;
  createdAt?: string;
}

interface Secret {
  id: number;
  type: string;
  fields: Record<string, any>;
  tags: string[];
  createdAt?: string;
}

const DashboardPage = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [secretsByVault, setSecretsByVault] = useState<Record<number, Secret[]>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch vaults on mount
  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaults`);
        if (!res.ok) {
          throw new Error('Failed to fetch vaults');
        }
        const data = await res.json();
        setVaults(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message ?? 'Error fetching vaults');
      }
    };
    fetchVaults();
  }, []);

  // Load secrets for a given vault
  const loadSecrets = async (vaultId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please sign in first.');
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secrets/vault/${vaultId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error('Failed to fetch secrets');
      }
      const data = await res.json();
      setSecretsByVault((prev) => ({ ...prev, [vaultId]: data }));
    } catch (err: any) {
      setError(err.message ?? 'Error fetching secrets');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h2 className="text-xl font-semibold mb-3">Vaults</h2>
        {vaults.length === 0 && <p>No vaults yet.</p>}
        <ul className="space-y-2">
          {vaults.map((vault) => (
            <li key={vault.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Vault #{vault.id}{vault.name ? ` - ${vault.name}` : ''}</span>
                <button
                  onClick={() => loadSecrets(vault.id)}
                  className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Load Secrets
                </button>
              </div>
              {secretsByVault[vault.id] && (
                <div className="mt-2 ml-4">
                  <h3 className="font-semibold">Secrets</h3>
                  {secretsByVault[vault.id].length === 0 ? (
                    <p className="text-sm text-gray-500">No secrets.</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {secretsByVault[vault.id].map((secret) => (
                        <li key={secret.id} className="text-sm">
                          Secret #{secret.id} ({secret.type})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
