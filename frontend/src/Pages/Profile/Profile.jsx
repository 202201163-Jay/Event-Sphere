import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const userId = localStorage.getItem("userId");

export const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userprofileData, setUserprofileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUserData(data.data);
          setEditData(data.data); // initialize editData with userData
        } else {
          toast.error(data.message || 'Failed to fetch user data');
        }
      } catch (error) {
        toast.error('Error fetching user data');
      }
    };
    if (userId) {
      fetchUserById();
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserprofileById = async () => {
      if (userData && userData.additionalDetails) {
        try {
          const id = userData.additionalDetails;
          const response = await fetch(`http://localhost:3000/api/users/profile/${id}`);
          const data = await response.json();

          if (response.ok) {
            setUserprofileData(data.data);
            setEditData((prev) => ({ ...prev, ...data.data })); // add profile details to editData
          } else {
            toast.error(data.message || 'Failed to fetch user profile data');
          }
        } catch (error) {
          toast.error('Error fetching user profile data');
        }
      }
    };

    fetchUserprofileById();
  }, [userData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const updatedUserData = {
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      password: editData.password, // Hash password before sending to backend
      image: editData.image,
      isVerified: editData.isVerified,
      additionalDetails: editData.additionalDetails
    };
  
    const updatedUserProfileData = {
      gender: editData.gender,
      dateOfBirth: editData.dateOfBirth,
      about: editData.about,
      participated: editData.participated,
    };
  
    try {
      // Update user data
      const userResponse = await fetch(`http://localhost:3000/api/users/update/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUserData)
      });
      const userResult = await userResponse.json();
  
      // Update user profile data
      const profileResponse = await fetch(`http://localhost:3000/api/users/updateProfile/${userprofileData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUserProfileData)
      });
      const profileResult = await profileResponse.json();
  
      if (userResult.status === "SUCCESS" && profileResult.status === "SUCCESS") {
        setUserData(userResult.data);
        setUserprofileData(profileResult.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile.")
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // console.log(userprofileData);

  const [formData, setFormData] = useState({
    email: '',
    userId: userId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Email cannot be empty');
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/student-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        if(responseData.message === "Oops, Your college is not exist!!!"){
          toast.error(responseData.message)
        }
        else{
          toast.success(responseData.message || 'Verification OTP email sent');
        }
        setFormData((prevData) => ({
          ...prevData,
          email: '',
        }));

        if (responseData.message === "User already verified!!!" || responseData.message === "Oops, Your college is not exist!!!") {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setTimeout(() => {
            navigate(`/profile-otp/${userId}`);
          }, 2000);
        }        
      } else {
        toast.error(responseData.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error, please try again');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            {/* Profile Header */}
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={userData?.image || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-500">{userData?.firstName} {userData?.lastName}</h3>
                  <p className="text-sm text-gray-400">Team Manager</p>
                  <p className="text-sm text-gray-500">Leeds, United Kingdom</p>
                </div>
              </div>
              <button
                // onClick={handleEditToggle}
                className="absolute top-4 right-4 flex items-center text-yellow-500 hover:text-yellow-600 bg-transparent border border-yellow-500 hover:border-yellow-600 rounded-full px-3 py-1"
              >
                <PencilIcon className="h-4 w-4 mr-1" /> {"Edit"}
              </button>
            </div>

            {/* Personal Information */}
            <div className="relative border border-gray-700 rounded-lg p-4 bg-gray-800">
              <h4 className="text-lg font-semibold text-yellow-500 mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userData?.firstName}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userData?.lastName}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email address</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userData?.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="gender"
                      value={editData.gender || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userprofileData?.gender || 'Not available'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date Of Birth</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editData.dateOfBirth || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userprofileData?.dateOfBirth || 'Not available'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">About</p>
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={editData.about || ''}
                      onChange={handleInputChange1}
                      className="bg-gray-900 text-white p-2 rounded"
                    />
                  ) : (
                    <p className="text-gray-200">{userprofileData?.about || 'Not available'}</p>
                  )}
                </div>
              </div>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="absolute top-4 right-4 flex items-center text-yellow-500 hover:text-yellow-600 bg-transparent border border-yellow-500 hover:border-yellow-600 rounded-full px-3 py-1"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="absolute top-4 right-4 flex items-center text-yellow-500 hover:text-yellow-600 bg-transparent border border-yellow-500 hover:border-yellow-600 rounded-full px-3 py-1"
                >
                  <PencilIcon className="h-4 w-4 mr-1" /> Edit
                </button>
              )}


            </div>
          </div>
        );
      case 'verify':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <ToastContainer />
            <div className="text-center mb-10">
              <h4 className="text-2xl font-semibold text-yellow-500">Student Verification</h4>
              <h3 className="mt-2 text-gray-400">Please enter your college email ID</h3>
            </div>
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label className="text-sm font-semibold text-gray-400">Email Address *</label>
                <input
                  className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-gray-800 p-2 rounded font-semibold hover:bg-yellow-600 transition duration-200"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        );
      case 'events':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h4 className="text-lg font-semibold text-yellow-500 mb-4">Events</h4>
      {/* <p className="text-gray-200 space-y-3">View and manage your registered events here.</p> */}
      
      {editData.participated && editData.participated.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {editData.participated.map((event, index) => (
            <li key={index} className="text-gray-200">
              {event.name} {/* Assuming each event has a 'name' property */}
            </li>
          ))}
        </ul>
      ) : (
        // <p className="text-gray-400">You have not participated in any events yet.</p>
        <ul className="list-none pl-0 space-y-4">
  <li className="bg-gray-700 p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-xl text-yellow-500">Tech Conference 2024</span>
      <span className="text-sm text-gray-400">- 10:00 AM, January 15</span>
    </div>
  </li>
  <li className="bg-gray-700 p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-xl text-yellow-500">Hackathon 2024</span>
      <span className="text-sm text-gray-400">- 3:00 PM, February 20</span>
    </div>
  </li>
</ul>
      )}
    </div>
        );
      case 'delete':
        return (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-semibold text-red-500 mb-4">Delete Account</h4>
            <p className="text-gray-200">Deleting your account is permanent and cannot be undone.</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Delete Account</button>
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
        <h2 className="text-2xl font-bold text-center mb-6">Account Settings</h2>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-1/4 pr-6">
            <nav className="space-y-4">
              <button
                onClick={() => setActiveSection('profile')}
                className={`block w-full text-left p-3 ${
                  activeSection === 'profile' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
                } rounded-md font-medium`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveSection('verify')}
                className={`block w-full text-left p-3 ${
                  activeSection === 'verify' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
                } rounded-md`}
              >
                Verify As Student
              </button>
              <button
                onClick={() => setActiveSection('events')}
                className={`block w-full text-left p-3 ${
                  activeSection === 'events' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'
                } rounded-md`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveSection('delete')}
                className={`block w-full text-left p-3 ${
                  activeSection === 'delete' ? 'text-red-500 bg-red-600' : 'text-gray-300 hover:bg-red-600'
                } rounded-md`}
              >
                Delete Account
              </button>
            </nav>
          </aside>


          <main className="w-3/4 bg-gray-900 rounded-lg shadow-inner p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};