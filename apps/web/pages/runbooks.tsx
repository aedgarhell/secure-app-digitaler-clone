import React, { useState, useEffect } from 'react';

/**
 * Runbooks Page
 *
 * This page allows a tenant to view and create runbooks. A runbook represents
 * documented procedures or instructions associated with a tenant. To fetch
 * runbooks, a tenant ID is required. The user can either input a tenant ID
 * manually or rely on one stored in localStorage. All requests are sent to
 * the API defined in `NEXT_PUBLIC_API_URL`. Authentication is handled via
 * a JWT stored in localStorage as `token`.
 */

interface Runbook {
  id: number;
  tenantId: number;
  title: string;
  markdown: string;
  createdAt?: string;
  attachments?: any[];
}

const RunbooksPage = () => {
  const [tenantId, setTenantId] = useState<string>('');
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [title, setTitle] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load tenantId from localStorage on mount if available
  useEffect(() => {
    const storedTenant = localStorage.getItem('tenantId');
    if (storedTenant) {
      setTenantId(storedTenant);
      void fetchRunbooks(storedTenant);
    }
  }, []);

  const fetchRunbooks = async (id: string) => {
    if (!id) return;
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/runbooks/tenant/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      if (!res.ok) {
        throw new Error('Failed to fetch runbooks');
      }
      const data = await res.json();
      setRunbooks(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching runbooks');
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRunbooks(tenantId);
    // Save tenant ID in localStorage for future sessions
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
    }
  };

  const createRunbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) {
      setError('Tenant ID is required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/runbooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          tenantId: Number(tenantId),
          title,
          markdown,
          attachments: [],
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to create runbook');
      }
      setTitle('');
      setMarkdown('');
      // Refresh runbooks list
      await fetchRunbooks(tenantId);
    } catch (err: any) {
      setError(err.message || 'Error creating runbook');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Runbooks</h1>
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
              Load Runbooks
            </button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <p>Loading...</p>}
          {!loading && runbooks.length === 0 && (
            <p className="text-gray-600">No runbooks found.</p>
          )}
          <ul className="space-y-2">
            {runbooks.map((rb) => (
              <li key={rb.id} className="border p-4 rounded bg-gray-50">
                <h3 className="font-semibold text-lg">{rb.title}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line mt-2">
                  {rb.markdown || 'No content'}
                </p>
                {rb.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Created at: {new Date(rb.createdAt).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Form to create a new runbook */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Create New Runbook</h2>
          <form onSubmit={createRunbook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Markdown / Instructions</label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="mt-1 w-full border rounded p-2 h-32"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Create Runbook'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RunbooksPage;