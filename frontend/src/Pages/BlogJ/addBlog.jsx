import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import EventDescription from "../Event_listing_page/eventDescription";
import Cookies from "js-cookie";
import config from "../../config";
import { ToastContainer, toast } from 'react-toastify';

const userId = Cookies.get("userId");

export const AddBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when submission starts

    const submissionData = new FormData(e.target);
    submissionData.append("clubId", userId);
    submissionData.append("date", Date.now());
    const title=submissionData.get("title")
    const college=submissionData.get("college")
    const content=submissionData.get("content")

    if (title.length <= 3 || title.length >= 30) {
      toast.error('Title must be between 3 and 30 characters.');
      setLoading(false); 
      return;
    }
    if (college.length <= 3 || college.length >= 30) {
      toast.error('College must be between 3 and 30 characters.');
      setLoading(false); 
      return;
    }

    if (content.length <= 10 || title.length >= 1000) {
      toast.error('Content must be between 10 and 1000 characters.');
      setLoading(false); 
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/blog/create", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/blogs");
    } catch (error) {
      setLoading(false); 
      console.error("Error adding blog:", error);
    } finally {
      setLoading(false); // Set loading state to false after submission attempt
    }
  };

  return (
    <>
      <div className="bg-cyan-100">
        <Navbar />
        <ToastContainer/>

        <div className="max-w-3xl mx-auto mt-32 mb-4 p-8 shadow-lg rounded-lg bg-gray-900 border border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Add New Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="block text-lg font-medium text-yellow-400">Title</label>
              <input
                type="text"
                name="title"
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                required
              />
            </div>

            {/* <div className="form-group">
              <label className="block text-lg font-medium text-yellow-400">Date</label>
              <input
                type="date"
                name="date"
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                required
              />
            </div> */}

            <div className="form-group">
              <label className="block text-lg font-medium text-yellow-400">College</label>
              <input
                type="text"
                name="college"
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-lg font-bold text-yellow-400">Content</label>
              <textarea
                name="content"
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                rows="5"
                required />
            </div>

            <div className="form-group">
              <label className="block text-lg font-medium text-yellow-400">Images</label>
              <input
                name="posters"
                type="file"
                multiple
                className="w-full p-3 border border-gray-600 rounded-md bg-gray-800 text-gray-200 focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>

            <button
              type="submit"
              className={`w-full text-gray-900 font-semibold p-3 rounded-md shadow-md transition duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}
              disabled={loading}
            >
              {loading ? 'Submitting Blog...' : 'Submit Blog'}
            </button>
          </form>
        </div>

        <div className="footer-addblog">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AddBlog;