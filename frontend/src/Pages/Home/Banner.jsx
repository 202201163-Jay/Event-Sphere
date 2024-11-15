import React, { useState, useEffect } from 'react';

const banners = [
  "https://via.placeholder.com/1200x400?text=Featured+Event+1",
  "https://via.placeholder.com/1200x400?text=Featured+Event+2",
  "https://via.placeholder.com/1200x400?text=Featured+Event+3",
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManual, setIsManual] = useState(false); // Track if the slide is manual

  // Automatically switch banners every 3 seconds
  useEffect(() => {
    if (isManual) {
      // Do not auto-slide when manually changing the banner
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000); // Slide every 3 seconds

    // Cleanup the interval when the component is unmounted or paused
    return () => clearInterval(intervalId);
  }, [isManual]);

  // Function to go to the next slide
  const nextSlide = () => {
    setIsManual(true); // Mark as manual transition
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    
    // After 3 seconds, resume automatic sliding
    setTimeout(() => {
      setIsManual(false);
    }, 3000);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setIsManual(true); // Mark as manual transition
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);

    // After 3 seconds, resume automatic sliding
    setTimeout(() => {
      setIsManual(false);
    }, 3000);
  };

  return (
    <div className="relative w-full overflow-hidden mr-8 mt-[120px]">
      {/* Slides */}
      <div
        className="flex transition-transform ease-in-out duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div className="min-w-full box-border p-1" key={index}>
            <a href="#" className="link">
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full block rounded-xl"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition duration-300"
      >
        &lt;
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition duration-300"
      >
        &gt;
      </button>
    </div>
  );
};

export default Banner;