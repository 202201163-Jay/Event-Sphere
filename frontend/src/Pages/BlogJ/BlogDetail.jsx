import React, { useState } from 'react';

export const BlogDetail = () => {
  const blogData = {
    title: 'Sample Blog Title',
    content: 'This is the blog content. It can be very long and include various details about the blog post...',
    images: [
      'https://via.placeholder.com/600x300?text=Image+1',
      'https://via.placeholder.com/600x300?text=Image+2',
      'https://via.placeholder.com/600x300?text=Image+3',
      // Add more images if needed
    ]
  };

  // State to manage the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? blogData.images.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === blogData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* Blog Title */}
      <h1 className="text-3xl font-semibold text-center mb-6">{blogData.title}</h1>

      {/* Image Slider */}
      <div className="relative">
        <img
          src={blogData.images[currentImageIndex]}
          alt={`Blog Image ${currentImageIndex + 1}`}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        {/* Navigation buttons */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
        >
          &#8592;
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
        >
          &#8594;
        </button>
      </div>

      {/* Blog Content */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg leading-relaxed">{blogData.content}</p>
      </div>
    </div>
  );
};

export default BlogDetail;
