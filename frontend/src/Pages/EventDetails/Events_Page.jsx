import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import EventCard from "../Home/Event_Card.jsx";
import Banner from "../Home/Banner.jsx";


export const Events_Page = () => {
    const [selectedCollege, setSelectedCollege] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [isCollegeOpen, setIsCollegeOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const events = [
        {
          name: 'Synapse',
          posterUrl: '/maxresdefault.jpg',
          rating: '9/10',
          college: 'DAIICT',
          date: '10 Nov, 2024',
            },
        {
            name: 'I-Fest',
            posterUrl: '/maxresdefault.jpg',
            rating: '9/10',
            college: 'DAIICT',
            date: '10 Nov, 2024',
            },
        {
            name: 'Concours',
            posterUrl: '/maxresdefault.jpg',
            rating: '9/10',
            college: 'DAIICT',
            date: '10 Nov, 2024',
            },
        {
            name: 'Youth Run',
            posterUrl: '/maxresdefault.jpg',
            rating: '9/10',
            college: 'DAIICT',
            date: '10 Nov, 2024',
          },
        {
            name: 'Tarang',
            posterUrl: '/maxresdefault.jpg',
            rating: '9/10',
            college: 'DAIICT',
            date: '10 Nov, 2024',
          },
      ];

      const colleges = ['DAIICT', 'NIFT', 'PDEU', 'Nirma'];
      const types = ['Concert', 'Coding', 'Sports'];

      // Function to toggle filter selections
        const toggleSelection = (setSelected, selectedArray, option) => {
            if (selectedArray.includes(option)) {
            setSelected(selectedArray.filter(item => item !== option));
            } else {
            setSelected([...selectedArray, option]);
            }
        };

        // Clear filter selection
        const clearAllFilters = () => {
            setSelectedCollege([]);
            setSelectedType([]);
          };

    
      return (
        <div className="bg-black-800 text-white min-h-screen">
          <Navbar/>
          {/* <div className="h-[92px]"></div> */}
          <Banner/>

        <section className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Filters</h2>
            </div>

            {/* Dropdown Filter Categories*/}
            <div className="flex space-x-4 mb-8">
            
            {/* Colleges Dropdown */}
            <div className="relative">
                <button
                onClick={() => setIsCollegeOpen(!isCollegeOpen)}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg"
                >
                Colleges
                </button>
                {isCollegeOpen && (
                <div className="absolute mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                    <div className="px-4 py-2 space-x-2 flex flex-wrap">
                    {colleges.map((college) => (
                        <button
                        key={college}
                        onClick={() => toggleSelection(setSelectedCollege, selectedCollege, college)}
                        className={`border rounded px-3 py-1 text-sm m-1 ${
                            selectedCollege.includes(college)
                            ? 'bg-red-100 text-red-500 border-red-500'
                            : 'bg-gray-200 text-gray-700 border-gray-300'
                        }`}
                        >
                        {college}
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>

            {/* Type Dropdown */}
            <div className="relative">
                <button
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg"
                >
                Type
                </button>
                {isTypeOpen && (
                <div className="absolute mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                    <div className="px-4 py-2 space-x-2 flex flex-wrap">
                    {types.map((type) => (
                        <button
                        key={type}
                        onClick={() => toggleSelection(setSelectedType, selectedType, type)}
                        className={`border rounded px-3 py-1 text-sm m-1 ${
                            selectedType.includes(type)
                            ? 'bg-red-100 text-red-500 border-red-500'
                            : 'bg-gray-200 text-gray-700 border-gray-300'
                        }`}
                        >
                        {type}
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                Clear All Filters
            </button>
            </div>
        </section>
    
        <section className="max-w-7xl mx-auto px-6 py-10">
            <h2 className="text-3xl font-semibold mb-6">Events Starting Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <div key={index} className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <Link to="/register-for-event">
                    <img
                        className="w-full h-72 object-cover"
                        src={event.posterUrl}
                        alt={`${event.name} Poster`}
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-black">{event.name}</h3>
                        <p className="text-gray-800 text-sm">{event.college}</p>
                        <p className="text-gray-500 text-sm">Date: {event.date}</p>
                        <div className="flex items-center space-x-2 mt-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 text-yellow-500"
                        >
                            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.84L19.33 24 12 20.115 4.67 24 6 15.59 0 9.75l8.332-1.595z" />
                        </svg>
                        <span className="text-gray-500">{event.rating}</span>
                        </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
        </section>
    
        <Footer/>
        </div>
      );
}

