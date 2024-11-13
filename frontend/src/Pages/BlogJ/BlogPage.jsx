import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { isLoggedIn, userId, type, image, name} = useAuth();

  // Fetch blogs on component mount
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

  // Fetch autocomplete suggestions based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/blog/suggestions?q=${debouncedQuery}`
          );
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error.message);
          console.error(error); // Logs full error details for debugging
        }
        
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  // Filter blogs based on the debounced query
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog) =>
        blog.title &&
        blog.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto my-8 p-4">
      <div className="relative flex justify-between items-center mb-8">
        <div className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="Search blog by title..."
            className="p-3 border rounded-md w-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-10">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion.title);
                    setShowSuggestions(false);
                  }}
                >
                  <strong>{suggestion.title}</strong>
                  <div className="text-sm text-gray-500">
                    {suggestion.college || "Unknown College"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {type === "club" && (
          <Link to="/add-blog" className="bg-blue-600 text-white px-5 py-3 rounded-md shadow-md ml-4 hover:bg-blue-700">Add Blog</Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Link to={`http://localhost:3000/api/blog/${blog._id}`}>
                <img
                  src={blog.images[0] || "https://via.placeholder.com/600x300"}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
                  <p className="text-sm text-gray-500">By: {blog.college || "Unknown College"}</p>
                  <p className="text-gray-600 mt-3">{blog.content.substring(0, 100)}...</p>
                </div>
              </Link>
              <div className="p-4 border-t text-right">
                <Link
                  to={`http://localhost:3000/api/blog/${blog._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
