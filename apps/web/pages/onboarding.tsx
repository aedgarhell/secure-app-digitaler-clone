import React, { useState } from 'react';
import Layout from '../components/Layout';

/**
 * Onboarding page allows administrators to create a new tenant and owner user.
 * This is a simplified version and may be adjusted to match the backend API.
 */
const OnboardingPage: React.FC = () => {
  const [tenantName, setTenantName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/onboarding/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantName, adminEmail, adminPassword }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setMessage('Onboarding started successfully.');
      setTenantName('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Tenant Onboarding</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tenant Name</label>
            <input
              className="border p-2 rounded w-full"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Admin Email</label>
            <input
              type="email"
              className="border p-2 rounded w-full"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Admin Password</label>
            <input
              type="password"
              className="border p-2 rounded w-full"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Onboarding'}
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </Layout>
  );
};

export default OnboardingPage;
