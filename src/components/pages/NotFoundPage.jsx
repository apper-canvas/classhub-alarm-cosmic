import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button'; // Assuming Button is used for navigation link styling

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-50 text-surface-800">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <p className="text-lg text-center mb-10">
        Oops! The page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;