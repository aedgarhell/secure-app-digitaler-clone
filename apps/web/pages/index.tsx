import React from 'react';
import Layout from '../components/Layout';

/**
 * Landing page for the Secure App. Presents a welcome message and
 * encourages users to navigate through the app using the navigation bar.
 */
const IndexPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Secure App</h1>
        <p className="text-gray-600">
          Welcome to your secure digital clone. Use the navigation above to
          manage tenants, users, vaults, secrets, runbooks, and more.
        </p>
      </div>
    </Layout>
  );
};

export default IndexPage;
