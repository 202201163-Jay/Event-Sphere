import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const userId = localStorage.getItem("userId");

export const ClubProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [clubData, setClubData] = useState(null);

  useEffect(() => {
    const fetchClubById = async () => {
      try {
        console.log('userId:', userId);
        console.log(localStorage)
        const response = await fetch(`http://localhost:3000/api/collegeRep/${userId}`);
        console.log(response)
        const data = await response.json();

        if (response.ok) {
          setClubData(data.data);
        } else {
          toast.error(data.message || 'Failed to fetch club data');
        }
      } catch (error) {
        toast.error('Error fetching club data');
      }
    };
    if (userId) {
      fetchClubById();
    }
  }, [userId]);

  const handleDeleteProfile = async() => {
    try {
      console.log(userId);
      const response = await fetch(`http://localhost:3000/api/college/delete/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("User deleted successfully");
        navigate("/logout");
      } else {
        toast.error("Error deleting profile");
      }
    } catch (error) {
      toast.error("Error deleting profile");
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={clubData?.image || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-500">{clubData?.clubName || ''}</h3>
                  <p className="text-sm text-gray-400">Club Manager</p>
                  <p className="text-sm text-gray-500">{clubData?.location || 'Unknown Location'}</p>
                </div>
              </div>
            </div>

            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <h4 className="text-lg font-semibold text-yellow-500 mb-2">Club Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Club name</p>
                  <p className="text-gray-200">{clubData?.clubName || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Club Email</p>
                  <p className="text-gray-200">{clubData?.email || ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Affiliated College</p>
                  <p className="text-gray-200">{clubData?.collegeName || ''}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
        case 'delete':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-red-500 mb-4">Delete Account</h4>
            <p className="text-gray-200">Deleting your account is permanent and cannot be undone.</p>
            <button onClick={handleDeleteProfile} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-md flex">
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Account
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Club Profile</h2>
        <div className="flex">
          <aside className="w-1/4 space-y-6 pr-4 border-r border-gray-700">
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'profile' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'event-details' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('event-details')}
            >
              All Event
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'delete' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('delete')}
            >
              Delete Account
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
