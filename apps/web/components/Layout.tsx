import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center space-x-6">
            <Link href="/" className="text-gray-900 font-semibold">
              Secure App
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/vaults" className="text-gray-600 hover:text-gray-900">
              Vaults
            </Link>
            <Link href="/runbooks" className="text-gray-600 hover:text-gray-900">
              Runbooks
            </Link>
            <Link href="/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link href="/audit" className="text-gray-600 hover:text-gray-900">
              Audit
            </Link>
            <Link href="/succession" className="text-gray-600 hover:text-gray-900">
              Succession
            </Link>
            <Link href="/secrets" className="text-gray-600 hover:text-gray-900">
              Secrets
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
