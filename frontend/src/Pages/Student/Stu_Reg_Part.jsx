import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Stu_Reg = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [verificationData, setVerificationData] = useState({
    domainName: '',
    verificationEmail: '',
    otp: '',
  });

  const [isSignedUp, setIsSignedUp] = useState(false); // Track if signup is done
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const [error, setError] = useState(''); // Handle errors
  const navigate = useNavigate();

  // Handle input change for signup form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle input change for verification form (Domain name and email)
  const handleVerificationInputChange = (e) => {
    const { name, value } = e.target;
    setVerificationData({
      ...verificationData,
      [name]: value,
    });
  };

  // Submit signup form
  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
      e.preventDefault()
      try {
        const response = await fetch("http://localhost:3000/api/auth/student-register", {
          method: "POST",
          headers: {"Content-Type" : "application/json",},
          body: JSON.stringify(formData),
        })

        if(response.ok){
          const responsedata = await response.json()
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          })
          console.log(responsedata)
          navigate("/")
        }

      } catch (error) {
        console.log(error)
      }
    //   setIsSignedUp(true);
    // } catch (error) {
    //   setError('Signup failed. Please try again.');
    // }
  };

  // Submit domain and email for OTP generation
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch("http://localhost:3000/api/auth/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationData.verificationEmail,
        }),
      });

      if (response.ok) {
        setIsOtpSent(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred while sending OTP');
    }
  };

  // Submit OTP for verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationData.verificationEmail,
          otp: verificationData.otp,
        }),
      });

      if (response.ok) {
        navigate("/"); // Redirect after successful verification
      } else {
        const data = await response.json();
        setError(data.message || 'OTP verification failed');
      }
    } catch (error) {
      setError('An error occurred during OTP verification');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {!isSignedUp ? (
          // Sign up form
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="w-full p-3 border rounded mb-4"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-full p-3 border rounded mb-4"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-full p-3 border rounded mb-4"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-full p-3 border rounded mb-4"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition-colors"
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </>
        ) : !isOtpSent ? (
          // Domain and email form (for verification)
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Verify as Student</h2>
            <form onSubmit={handleVerificationSubmit}>
              <input
                className="w-full p-3 border rounded mb-4"
                type="text"
                name="domainName"
                placeholder="Enter Domain Name"
                value={verificationData.domainName}
                onChange={handleVerificationInputChange}
                required
              />
              <input
                className="w-full p-3 border rounded mb-4"
                type="email"
                name="verificationEmail"
                placeholder="Enter Verification Email"
                value={verificationData.verificationEmail}
                onChange={handleVerificationInputChange}
                required
              />
              <button
                className="w-full bg-blue-500 text-white p-3 rounded font-bold hover:bg-blue-600 transition-colors"
                type="submit"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          // OTP verification form
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <input
                className="w-full p-3 border rounded mb-4"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={verificationData.otp}
                onChange={handleVerificationInputChange}
                required
              />
              <button
                className="w-full bg-blue-500 text-white p-3 rounded font-bold hover:bg-blue-600 transition-colors"
                type="submit"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {/* Error handling */}
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
};
