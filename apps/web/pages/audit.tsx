import React, { useEffect, useState } from 'react';

/**
 * UI component for viewing audit logs. The page fetches all logs on mount and
 * allows filtering logs by actor ID or action type. It communicates with
 * the API via the paths `/audit`, `/audit/actor/:actorId` and
 * `/audit/action/:action` configured in the NestJS API. Adjust the
 * `NEXT_PUBLIC_API_URL` environment variable to point to your API server.
 */
interface AuditLog {
  id: number;
  actor: string;
  action: string;
  target: string;
  ts: string;
}

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch audit logs from the provided endpoint and update state.
   * @param url API endpoint to call
   */
  const fetchLogs = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setLogs(data);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    }
  };

  // initial fetch of all logs
  useEffect(() => {
    fetchLogs(`${process.env.NEXT_PUBLIC_API_URL}/audit`);
  }, []);

  /**
   * Handle submitting the actor filter form.
   */
  const handleActorFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (actorFilter.trim() === '') return;
    fetchLogs(`${process.env.NEXT_PUBLIC_API_URL}/audit/actor/${actorFilter}`);
  };

  /**
   * Handle submitting the action filter form.
   */
  const handleActionFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionFilter.trim() === '') return;
    fetchLogs(`${process.env.NEXT_PUBLIC_API_URL}/audit/action/${encodeURIComponent(actionFilter)}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <div className="mb-4 space-y-2">
        <form onSubmit={handleActorFilter} className="flex items-center space-x-2">
          <input
            type="number"
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            placeholder="Filter by actor ID"
            className="border p-2 rounded w-40"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Filter
          </button>
        </form>
        <form onSubmit={handleActionFilter} className="flex items-center space-x-2">
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="Filter by action"
            className="border p-2 rounded w-40"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Filter
          </button>
        </form>
        <button
          onClick={() => fetchLogs(`${process.env.NEXT_PUBLIC_API_URL}/audit`)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
      {error && <p className="text-red-600">Error: {error}</p>}
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Actor</th>
            <th className="px-4 py-2 border">Action</th>
            <th className="px-4 py-2 border">Target</th>
            <th className="px-4 py-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2 border">{log.id}</td>
              <td className="px-4 py-2 border">{log.actor}</td>
              <td className="px-4 py-2 border">{log.action}</td>
              <td className="px-4 py-2 border">{log.target}</td>
              <td className="px-4 py-2 border">{new Date(log.ts).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditPage;