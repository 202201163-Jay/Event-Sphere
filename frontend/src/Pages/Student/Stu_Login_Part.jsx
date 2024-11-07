import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Stu_Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success("Login Successful !!");
        const responsedata = await response.json();
        storeTokenInLs(responsedata.token, responsedata.name);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 401 || response.status === 403) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer/>
      <div className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <h3 className="text-lg text-center mb-4">Login to your Account</h3>
        <p className="text-center mb-6">Let's start exploring events tailored for you!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400">Email Address *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={user.email}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400">Password *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={user.password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition-colors"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link className="text-green-500 hover:underline" to="/student-register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};