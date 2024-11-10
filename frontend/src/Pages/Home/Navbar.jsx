import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const Navbar = () => {
  const { isLoggedIn, username } = useAuth();
  const { isCollegeRepresentative } = useAuth();

  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      {isLoggedIn ? (
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      ) : (
        <li>
          <Link to="/login">Login</Link>
        </li>
      )}

      <li>
        <Link to="/blogs">Blogs</Link>
      </li>
      <li>
        <a>About</a>
      </li>
      {isCollegeRepresentative && (
        <li>
          <Link to="/listing">List Events</Link>
        </li>
      )}
    </>
  );

  return (
    <>
      <div
        className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          sticky
            ? "sticky-navbar shadow-lg bg-white text-black"
            : "bg-gray-100 text-black"
        }`}
      >
        <div className="navbar py-4">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {navItems}
              </ul>
            </div>
            <a className="text-2xl font-bold cursor-pointer text-indigo-500">
              Event Sphere
            </a>
          </div>
          <div className="navbar-end space-x-3">
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 space-x-6 font-medium text-gray-600">
                {navItems}
              </ul>
            </div>
            <div className="hidden md:block">
              <label className="px-3 py-2 border rounded-md flex items-center gap-2 bg-gray-200">
                <input
                  type="search"
                  className="w-full px-4 py-2 border-none border-gray-300 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            {isLoggedIn ? (
              <div>
                <Link
                  to="/logout"
                  className="bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-700 duration-300"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  className="bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-700 duration-300"
                >
                  Login
                </Link>
              </div>
            )}
            <div>{isLoggedIn ? <div>{username}</div> : <div></div>}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;