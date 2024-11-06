import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export const Col_Login = () => {
  const [collegeRep, setCollegeRep] = useState({
    email: "",
    password: "",
  });


  const {storeTokenInLs} = useAuth()
  const {isCollegeRepresentative, setIsCollegeRepresentative} = useAuth()
  const navigate = useNavigate();

  const toggle = () => {
    setIsCollegeRepresentative(prev => !prev)
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCollegeRep({ ...collegeRep, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/college-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collegeRep),
      });

      if (response.ok) {
        alert("Login Successful !!");
        const responseData = await response.json();
        storeTokenInLs(responseData.token, collegeRep.name)
        toggle()
        // swapped()
        
        // isCollegeRepresentative = true
        // console.log(isCollegeRepresentative)
        console.log(responseData);
        navigate("/");  // Redirect to home or dashboard after successful login
      } else if (response.status === 401 || response.status === 403) {
        alert("Invalid Credentials");
      } else {
        alert("Something went wrong, please try again");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <div className="w-full px-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        <h2 className="text-2xl font-bold">Login to your Account</h2>
        <h3 className="mt-2">It's nice to see you again. Ready to conquer?</h3>
      </div>
      <div className="flex flex-col items-center">
        <form className="w-full" onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border rounded mb-4"
            type="text"
            name="email"
            placeholder="Your Work email"
            value={collegeRep.email}
            onChange={handleInput}
            required
          />
          <input
            className="w-full p-2 border rounded mb-4"
            type="password"
            name="password"
            placeholder="Your Password"
            value={collegeRep.password}
            onChange={handleInput}
            required
          />
          <div className='flex justify-center'>
            <button className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Log In</button>
          </div>
        </form>
      </div>
      <div className="text-center mt-4">
        <h3>Don't have an account? <Link className="text-blue-500 hover:underline" to="/college-register">Sign Up</Link></h3>
      </div>
    </div>
  );
};
