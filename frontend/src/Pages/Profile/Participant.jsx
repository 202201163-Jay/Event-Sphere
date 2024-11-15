import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const userId = localStorage.getItem("userId");

export const Participants = () => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      
    };

    fetchParticipants();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Participants</h2>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading participants...</p>
          ) : participants.length > 0 ? (
            <table className="table-auto w-full text-left bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-yellow-500">#</th>
                  <th className="px-4 py-2 text-yellow-500">Name</th>
                  <th className="px-4 py-2 text-yellow-500">Contact</th>
                  <th className="px-4 py-2 text-yellow-500">Email</th>
                  <th className="px-4 py-2 text-yellow-500">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant._id} className="border-t border-gray-600 hover:bg-gray-700">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{participant.name || "N/A"}</td>
                    <td className="px-4 py-2">{participant.contact || "N/A"}</td>
                    <td className="px-4 py-2">{participant.email || "N/A"}</td>
                    <td className="px-4 py-2">{new Date(participant.registeredAt).toLocaleString() || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center">No participants available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;