import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface Vault {
  id: number;
  name?: string;
  createdAt?: string;
}

interface Secret {
  id: number;
  type: string;
  tags: string[];
  createdAt?: string;
  // additional fields are stored in an open ended record
  fields?: Record<string, any>;
}

/**
 * Dashboard page shows all vaults for the current tenant and lists
 * the secrets associated with each vault. Data is fetched from the API
 * defined by NEXT_PUBLIC_API_URL environment variable.
 */
const DashboardPage: React.FC = () => {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [secretsByVault, setSecretsByVault] = useState<Record<number, Secret[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // fetch list of vaults when component mounts
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
      }
    };

    fetchVaults();
  }, []);

  // fetch secrets for each vault whenever the vault list changes
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const secretMap: Record<number, Secret[]> = {};
        await Promise.all(
          vaults.map(async (vault) => {
            const res = await fetch(`${baseUrl}/vaults/${vault.id}/secrets`);
            if (!res.ok) {
              throw new Error(`Failed to fetch secrets for vault ${vault.id}`);
            }
            const secrets: Secret[] = await res.json();
            secretMap[vault.id] = secrets;
          })
        );
        setSecretsByVault(secretMap);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vaults.length > 0) {
      fetchSecrets();
    } else {
      setLoading(false);
    }
  }, [vaults]);

  if (error) {
    return (
      <Layout>
        <div className="p-4 text-red-500">
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p>Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-8">
            {vaults.map((vault) => (
              <div key={vault.id} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-medium mb-2">
                  Vault {vault.name || vault.id}
                </h2>
                {secretsByVault[vault.id] && secretsByVault[vault.id].length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {secretsByVault[vault.id].map((secret) => (
                      <li key={secret.id}>
                        <span className="font-medium">{secret.type}</span>
                        {secret.tags && secret.tags.length > 0 && (
                          <> — <span className="text-gray-500">{secret.tags.join(', ')}</span></>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No secrets found.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
