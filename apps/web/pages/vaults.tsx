import React, { useState, useEffect } from 'react';

/**
 * Vaults Page
 *
 * This page lets a tenant view and create vaults as well as manage the
 * secrets within each vault. A tenant ID must be provided either via
 * an input field or from localStorage. All requests are made to the API
 * exposed at `NEXT_PUBLIC_API_URL`. Authentication is handled via a JWT
 * stored in localStorage under the key `token`. When viewing a vault's
 * secrets, the list is fetched on demand. Users can also create new
 * secrets with arbitrary JSON payloads and decrypt existing secrets.
 */

interface Vault {
  id: number;
  name: string;
  tenantId: number;
}

interface Secret {
  id: number;
  type: string;
  tags: string[];
  createdAt?: string;
}

const VaultsPage = () => {
  const [tenantId, setTenantId] = useState<string>('');
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [newVaultName, setNewVaultName] = useState('');
  const [secretsByVault, setSecretsByVault] = useState<Record<number, Secret[]>>({});
  const [secretForms, setSecretForms] = useState<
    Record<number, { type: string; fields: string; tags: string }>
  >({});
  const [decrypts, setDecrypts] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // On mount: load tenant ID from localStorage and fetch vaults
  useEffect(() => {
    const storedTenant = localStorage.getItem('tenantId');
    if (storedTenant) {
      setTenantId(storedTenant);
      void fetchVaults(storedTenant);
    }
  }, []);

  /**
   * Fetch all vaults and filter them by the tenant ID. Requires a JWT token
   * in localStorage. If no tenant ID is provided, the call is skipped.
   */
  const fetchVaults = async (id?: string) => {
    const tid = id || tenantId;
    if (!tid) return;
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaults`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch vaults');
      }
      const data = await res.json();
      // Filter vaults belonging to the current tenant
      const list = Array.isArray(data)
        ? data.filter((v: Vault) => v.tenantId === Number(tid))
        : [];
      setVaults(list);
    } catch (err: any) {
      setError(err.message || 'Error fetching vaults');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler for tenant ID submission. Persists the tenant ID and triggers
   * a vault fetch.
   */
  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVaults(tenantId);
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
    }
  };

  /**
   * Create a new vault for the current tenant. Requires a vault name and
   * tenant ID. On success, the vault list is reloaded.
   */
  const createVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !newVaultName) {
      setError('Tenant ID and vault name are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vaults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: newVaultName,
          tenantId: Number(tenantId),
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to create vault');
      }
      setNewVaultName('');
      await fetchVaults(tenantId);
    } catch (err: any) {
      setError(err.message || 'Error creating vault');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load secrets for a specific vault. On success, updates the secretsByVault
   * state. If secrets are already loaded for the vault, they will be cleared
   * to collapse the section.
   */
  const toggleSecrets = async (vaultId: number) => {
    if (secretsByVault[vaultId]) {
      const updated = { ...secretsByVault };
      delete updated[vaultId];
      setSecretsByVault(updated);
      return;
    }
    await loadSecrets(vaultId);
  };

  /**
   * Fetch the secrets belonging to a vault and update state.
   */
  const loadSecrets = async (vaultId: number) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secrets/vault/${vaultId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        },
      );
      if (!res.ok) {
        throw new Error('Failed to fetch secrets');
      }
      const data = await res.json();
      setSecretsByVault((prev) => ({ ...prev, [vaultId]: data }));
    } catch (err: any) {
      setError(err.message || 'Error fetching secrets');
    }
  };

  /**
   * Update values of the secret creation form for a specific vault.
   */
  const handleSecretFormChange = (
    vaultId: number,
    field: 'type' | 'fields' | 'tags',
    value: string,
  ) => {
    setSecretForms((prev) => ({
      ...prev,
      [vaultId]: {
        ...prev[vaultId],
        [field]: value,
      },
    }));
  };

  /**
   * Create a new secret within a vault. Parses the JSON fields and sends a
   * POST request. On success, it reloads the secrets for that vault.
   */
  const createSecret = async (e: React.FormEvent, vaultId: number) => {
    e.preventDefault();
    const form = secretForms[vaultId] || { type: '', fields: '', tags: '' };
    if (!form.type || !form.fields) {
      setError('Secret type and fields are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = {
        vaultId,
        type: form.type,
        fields: JSON.parse(form.fields),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/secrets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error('Failed to create secret');
      }
      // Reset form fields
      setSecretForms((prev) => ({
        ...prev,
        [vaultId]: { type: '', fields: '', tags: '' },
      }));
      // Reload secrets for this vault
      await loadSecrets(vaultId);
    } catch (err: any) {
      setError(err.message || 'Error creating secret');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Decrypt the secret payload and display it. The decrypted JSON is
   * stringified and stored in the decrypts state keyed by secret ID.
   */
  const decryptSecret = async (secretId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secrets/${secretId}/decrypt`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        },
      );
      if (!res.ok) {
        throw new Error('Failed to decrypt secret');
      }
      const data = await res.json();
      setDecrypts((prev) => ({
        ...prev,
        [secretId]: JSON.stringify(data, null, 2),
      }));
    } catch (err: any) {
      setError(err.message || 'Error decrypting secret');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Vaults</h1>
          <form onSubmit={handleFetch} className="flex items-end space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Tenant ID</label>
              <input
                type="text"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="Enter tenant ID"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Load Vaults
            </button>
          </form>
          {/* New Vault */}
          <form onSubmit={createVault} className="flex items-end space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">New Vault Name</label>
              <input
                type="text"
                value={newVaultName}
                onChange={(e) => setNewVaultName(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                placeholder="New vault name"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Create Vault
            </button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <p>Loading...</p>}
          {!loading && vaults.length === 0 && (
            <p className="text-gray-600">No vaults found.</p>
          )}
          <ul className="space-y-4">
            {vaults.map((vault) => (
              <li key={vault.id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{vault.name}</h3>
                    <p className="text-sm text-gray-500">ID: {vault.id}</p>
                  </div>
                  <button
                    onClick={() => toggleSecrets(vault.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    {secretsByVault[vault.id] ? 'Hide Secrets' : 'Show Secrets'}
                  </button>
                </div>
                {secretsByVault[vault.id] && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-md font-semibold mb-2">Secrets</h4>
                    {secretsByVault[vault.id].length === 0 && (
                      <p className="text-gray-600">No secrets found for this vault.</p>
                    )}
                    {secretsByVault[vault.id].map((secret) => (
                      <div
                        key={secret.id}
                        className="border p-3 rounded bg-white"
                      >
                        <p className="font-medium">Type: {secret.type}</p>
                        <p className="text-sm text-gray-600">
                          Tags: {secret.tags.join(', ') || 'None'}
                        </p>
                        <button
                          onClick={() => decryptSecret(secret.id)}
                          className="mt-1 text-blue-600 hover:underline"
                        >
                          Decrypt
                        </button>
                        {decrypts[secret.id] && (
                          <pre className="mt-2 bg-gray-200 p-2 rounded text-sm whitespace-pre-wrap">
                            {decrypts[secret.id]}
                          </pre>
                        )}
                      </div>
                    ))}
                    {/* New Secret */}
                    <form
                      onSubmit={(e) => createSecret(e, vault.id)}
                      className="mt-4 space-y-2"
                    >
                      <h5 className="font-semibold">Create Secret</h5>
                      <div>
                        <label className="block text-sm font-medium">Type</label>
                        <input
                          type="text"
                          value={secretForms[vault.id]?.type || ''}
                          onChange={(e) =>
                            handleSecretFormChange(vault.id, 'type', e.target.value)
                          }
                          className="mt-1 w-full border rounded p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Fields (JSON)</label>
                        <textarea
                          value={secretForms[vault.id]?.fields || ''}
                          onChange={(e) =>
                            handleSecretFormChange(vault.id, 'fields', e.target.value)
                          }
                          className="mt-1 w-full border rounded p-2 h-24"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={secretForms[vault.id]?.tags || ''}
                          onChange={(e) =>
                            handleSecretFormChange(vault.id, 'tags', e.target.value)
                          }
                          className="mt-1 w-full border rounded p-2"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                      >
                        Save Secret
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VaultsPage;
