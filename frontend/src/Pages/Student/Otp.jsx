import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Otp = () => {
    const navigate = useNavigate();
    
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        navigate('/student-login');
    }
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Only take the first character
    setCode(newCode);

    // Automatically focus on the next input
    if (value && index < code.length - 1) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-6 bg-gray-800 text-white rounded-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify email</h2>
        <p className="mb-6">A verification code has been sent to you. Enter the code below</p>
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-2xl text-center rounded border border-gray-700 bg-gray-900 focus:outline-none focus:border-yellow-500"
            />
          ))}
        </div>
        <button className="w-full py-3 bg-yellow-500 text-gray-800 font-semibold rounded hover:bg-yellow-600 transition duration-200">
          Verify email
        </button>
        <div className="mt-4 text-sm flex justify-between">
          <button className="text-gray-400 hover:underline" onClick={handleSubmit}>← Back to login</button>
        </div>
      </div>
    </div>
  );
};