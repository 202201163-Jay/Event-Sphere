// src/Pages/BlogJ/AddBlog.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    college: "",
    posters: [],
  });
  const navigate = useNavigate();

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file changes for multiple image uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Display the formData for debugging
    console.log("Form Data:", formData);

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);
    submissionData.append("date", formData.date);
    submissionData.append("college", formData.college);

    formData.images.forEach((image) => submissionData.append("posters", image));

    console.log(submissionData);

    try {
      await axios.post("http://localhost:3000/api/blog/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/blog");
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 shadow-lg border rounded-lg bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Add New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">College</label>
          <input
            type="text"
            name="college"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={formData.college}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            multiple
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md shadow-md transition duration-300"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
