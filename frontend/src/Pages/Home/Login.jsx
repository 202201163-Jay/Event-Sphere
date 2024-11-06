import React from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white drop-shadow-md">
          Welcome to <span className="text-blue-600">EVENTSPHERE</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          The ultimate platform for managing and participating in college events
        </p>
      </div>

      <div className="mt-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <Link
          to="/student-login"
          className="px-8 py-4 text-lg font-semibold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transform transition duration-300 hover:-translate-y-1"
        >
          Student Login
        </Link>
        <Link
          to="/college-login"
          className="px-8 py-4 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transform transition duration-300 hover:-translate-y-1"
        >
          College Login
        </Link>
      </div>

      <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <Link
          to="/student-register"
          className="px-8 py-4 text-lg font-semibold bg-green-400 text-white rounded-lg shadow-md hover:bg-green-500 transform transition duration-300 hover:-translate-y-1"
        >
          Student Register
        </Link>
        <Link
          to="/college-register"
          className="px-8 py-4 text-lg font-semibold bg-blue-400 text-white rounded-lg shadow-md hover:bg-blue-500 transform transition duration-300 hover:-translate-y-1"
        >
          College Register
        </Link>
      </div>
    </div>
  );
};
