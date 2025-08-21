import React, { useState, useEffect } from 'react';

const OnboardingPage = () => {
  const [step, setStep] = useState<'form' | 'progress'>('form');
  const [tenantName, setTenantName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [progress, setProgress] = useState({ vaults: 0, secrets: 0, runbooks: 0 });
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startOnboarding = async (e: React.FormEvent) => {
  	e.preventDefault();
  	setError(null);
  	try {
  		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding`, {
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/json',
  			},
  			body: JSON.stringify({
  				tenantName,
  				ownerEmail,
  				ownerPassword,
  			}),
  		});
  		if (!res.ok) {
  			throw new Error('Failed to start onboarding');
  		}
  		const data = await res.json();
  		const id = data.id ?? data.tenant?.id;
  		setTenantId(id);
  		setStep('progress');
  	} catch (err: any) {
  		setError(err.message ?? 'Error starting onboarding');
  	}
  };

  const fetchProgress = async () => {
  	if (!tenantId) return;
  	try {
  		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/${tenantId}`);
  		if (!res.ok) {
  			throw new Error('Failed to fetch progress');
  		}
  		const data = await res.json();
  		setProgress(data);
  		const completed = (data.vaults ?? 0) + (data.secrets ?? 0) + (data.runbooks ?? 0);
  		const percent = Math.min(100, Math.round((completed / 3) * 100));
  		setProgressPercent(percent);
  	} catch (err: any) {
  		setError(err.message ?? 'Error fetching progress');
  	}
  };

  useEffect(() => {
  	let interval: NodeJS.Timeout;
  	if (step === 'progress') {
  		fetchProgress();
  		interval = setInterval(fetchProgress, 10000);
  	}
  	return () => {
  		if (interval) {
  			clearInterval(interval);
  		}
  	};
  }, [step, tenantId]);

  return (
  	<div className="min-h-screen flex items-center justify-center bg-gray-100">
  		<div className="w-full max-w-md bg-white p-8 rounded shadow">
  			{step === 'form' && (
  				<>
  					<h1 className="text-2xl font-bold mb-4">Onboarding</h1>
  					{error && <p className="text-red-500 mb-4">{error}</p>}
  					<form onSubmit={startOnboarding} className="space-y-4">
  						<div>
  							<label className="block text-sm font-medium">Tenant Name</label>
  							<input
  								type="text"
  								value={tenantName}
  								onChange={(e) => setTenantName(e.target.value)}
  								className="mt-1 w-full border rounded p-2"
  								required
  							/>
  						</div>
  						<div>
  							<label className="block text-sm font-medium">Owner Email</label>
  							<input
  								type="email"
  								value={ownerEmail}
  								onChange={(e) => setOwnerEmail(e.target.value)}
  								className="mt-1 w-full border rounded p-2"
  								required
  							/>
  						</div>
  						<div>
  							<label className="block text-sm font-medium">Owner Password</label>
  							<input
  								type="password"
  								value={ownerPassword}
  								onChange={(e) => setOwnerPassword(e.target.value)}
  								className="mt-1 w-full border rounded p-2"
  								required
  							/>
  						</div>
  						<button
  							type="submit"
  							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
  						>
  							Start Onboarding
  						</button>
  					</form>
  				</>
  			)}

  			{step === 'progress' && (
  				<>
  					<h1 className="text-2xl font-bold mb-4">Onboarding Progress</h1>
  					{error && <p className="text-red-500 mb-4">{error}</p>}
  					<div className="mb-4">
  						<div className="h-4 w-full bg-gray-200 rounded">
  							<div
  								className="bg-blue-600 h-4 rounded"
  								style={{ width: `${progressPercent}%` }}
  							></div>
  						</div>
  						<p className="mt-2 text-sm">{progressPercent}% complete</p>
  						<p className="text-sm">Vaults: {progress.vaults || 0}/1</p>
  						<p className="text-sm">Secrets: {progress.secrets || 0}/1</p>
  						<p className="text-sm">Runbooks: {progress.runbooks || 0}/1</p>
  					</div>
  					<button
  						onClick={fetchProgress}
  						className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
  					>
  						Refresh Progress
  					</button>
  				</>
  			)}
  		</div>
  	</div>
  );
};

export default OnboardingPage;
