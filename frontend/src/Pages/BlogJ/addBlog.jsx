// src/Pages/BlogJ/AddBlog.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [college, setCollege] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // Handle file changes for multiple image uploads
  const handleFileChange = (e) => {
    const files = e.target.files;
    const imagesArray = [];
    for (let i = 0; i < files.length; i++) {
      imagesArray.push(files[i]);
    }
    setImages(imagesArray);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("college", college);
    
    // Append images to form data
    images.forEach((image) => formData.append("images", image));

    try {
      await axios.post("/api/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/blogs"); // Navigate to blog page after success
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Content</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">College</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            multiple
            className="w-full p-2 border rounded-md"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
