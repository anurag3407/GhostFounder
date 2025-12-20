"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome to GhostFounder!
                </h1>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  User Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Name:</span>
                    <span className="text-gray-900">
                      {currentUser?.displayName || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Email:</span>
                    <span className="text-gray-900">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">User ID:</span>
                    <span className="text-gray-600 text-sm">{currentUser?.uid}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  You are successfully logged in! This is your home page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
