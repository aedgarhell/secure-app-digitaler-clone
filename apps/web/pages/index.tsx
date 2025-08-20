import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Secure App</h1>
      <p className="text-lg text-gray-600">Welcome to the Secure App onboarding portal.</p>
      <p className="mt-4 text-center max-w-xl">
        This interface will guide administrators through setting up customers, vaults, secrets and runbooks.
      </p>
    </div>
  );
};

export default HomePage;
