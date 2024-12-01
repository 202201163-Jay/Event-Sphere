import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';
import { useAuth } from '../../Context/AuthProvider';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

export const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const image = Cookies.get("image");
  const [loading, setLoading] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            {/* Profile Header */}
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={image || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-500">Event Sphere Team</h3>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Colleges':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <ToastContainer />
            <div className="text-center mb-10">
              <h4 className="text-2xl font-semibold text-yellow-500">View registered colleges</h4>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-400">Club Name *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  name="clubName"
                  placeholder="Enter club name"
                  value={formData.clubName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400">Club email *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  type="email"
                  name="email"
                  placeholder="Enter club email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center top-24 w-full min-h-screen bg-gray-900 pb-24">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8 mt-28">
        <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Account</h2>

        <div className="flex">
          <aside className="w-1/4 space-y-6 pr-4 border-r border-gray-700">
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'profile' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'Colleges' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('add-club')}
            >
              Colleges
            </button>
          </aside>

          <main className="w-3/4 bg-gray-900 rounded-lg shadow-inner p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};