import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export const Stu_Login = () => {
  
  const [user, setUser] = useState({
    email: "",
    password: "",
  })


  const {storeTokenInLs} = useAuth()
  const navigate = useNavigate()

  const handleInput = (e) => {
    const {name, value} = e.target
    setUser({...user, [name]:value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/api/auth/student-login", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(user),
      })
      console.log(response)
      if(response.ok){
        alert("Login Successful !!")
        const responsedata = await response.json()
        storeTokenInLs(responsedata.token, responsedata.name)
        console.log(responsedata.name)
        navigate("/")
      }
      else if(response.status === 401){
        alert("Invalid Credentials")
      }
      else{
        alert("Something went wrong, please try again")
      }

    } catch (error) {
      console.error("Error during login", error)
    }
  }

  return (
    <>
        <div className="w-full px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <h2 className="text-2xl font-bold">Login to your Account</h2>
            <h3 className="mt-2">Let's start exploring events tailored for you!</h3>
          </div>
          <div className="flex flex-col items-center">
            <form className="w-full" onSubmit={handleSubmit}>
              <input className="w-full p-2 border rounded mb-4" type="email" name="email" placeholder="Enter Your Email" value={user.email} onChange={handleInput}/>
              <input className="w-full p-2 border rounded mb-4" type="password" name="password" placeholder="Enter Your Password" value={user.password} onChange={handleInput} />
              <div className='flex justify-center'>
                <button className="w-1/2 bg-green-500 text-white p-2 rounded hover:bg-green-600">Log In</button>
              </div>
            </form>
          </div>
          <div className="text-center mt-4">
            <h3>Don't have an account? <Link className="text-green-500 hover:underline" to="/student-register">Sign Up</Link></h3>
          </div>
        </div>
    </>
  );
};
