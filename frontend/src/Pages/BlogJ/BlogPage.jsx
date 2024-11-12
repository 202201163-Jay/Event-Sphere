import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/blog");
        console.log("API Response:", response); 
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.error("Expected an array, but received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);
  

  // Debounce search query to avoid making API requests on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Adjust the debounce time as needed

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter blogs based on the debounced query, ensure blogs is an array
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog) =>
        blog.title && blog.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search blog by title"
          className="p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link
          to="/add-blog"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md">
              <Link to={`/blogs/${blog._id}`}>
                <img
                  src={blog.images[0] || "https://via.placeholder.com/600x300"} // Fallback image if no images exist
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{blog.title}</h2>
              </Link>
              <p className="text-gray-600">{blog.content.substring(0, 100)}...</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
