import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface AuditLog {
  id: number;
  actor: string;
  action: string;
  target: string;
  ts: string;
}

/**
 * Audit page displays a list of audit log entries fetched from the API.
 * Users can filter logs by actor or action.
 */
const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/audit`);
        if (!res.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data: AuditLog[] = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const actorMatch = actorFilter ? log.actor.includes(actorFilter) : true;
    const actionMatch = actionFilter ? log.action.includes(actionFilter) : true;
    return actorMatch && actionMatch;
  });

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Audit Logs</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="flex space-x-4 mb-4">
              <input
                className="border p-2 rounded w-full"
                placeholder="Filter by actor"
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
              />
              <input
                className="border p-2 rounded w-full"
                placeholder="Filter by action"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              />
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b py-2">Timestamp</th>
                  <th className="border-b py-2">Actor</th>
                  <th className="border-b py-2">Action</th>
                  <th className="border-b py-2">Target</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 border-b">{new Date(log.ts).toLocaleString()}</td>
                    <td className="py-2 border-b">{log.actor}</td>
                    <td className="py-2 border-b">{log.action}</td>
                    <td className="py-2 border-b">{log.target}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No audit logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AuditPage;
