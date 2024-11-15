import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import EventCard from "../Home/Event_Card.jsx";
import Banner from "../Home/Banner.jsx";
import axios from "axios";


export const Events_Page = () => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const [events, setEvents] = useState([]);

    useEffect(()=>{
        console.log("first")
        const getAllEvents = async () => {
            try {
                const results = await axios.get("http://localhost:3000/api/home/trending");
                console.log("results", results);
                setEvents(results.data.trendingEvents);
            } catch (error) {
                console.log(error);
            }
        }; 

        getAllEvents();
    },[]);



    // const events = [
    //     {
    //         name: 'Synapse',
    //         posterUrl: '/maxresdefault.jpg',
    //         rating: '9/10',
    //         college: 'DAIICT',
    //         date: '10 Nov, 2024',
    //     },
    //     {
    //         name: 'I-Fest',
    //         posterUrl: '/maxresdefault.jpg',
    //         rating: '9/10',
    //         college: 'DAIICT',
    //         date: '10 Nov, 2024',
    //     },
    //     {
    //         name: 'Concours',
    //         posterUrl: '/maxresdefault.jpg',
    //         rating: '9/10',
    //         college: 'DAIICT',
    //         date: '10 Nov, 2024',
    //     },
    //     {
    //         name: 'Youth Run',
    //         posterUrl: '/maxresdefault.jpg',
    //         rating: '9/10',
    //         college: 'DAIICT',
    //         date: '10 Nov, 2024',
    //     },
    //     {
    //         name: 'Tarang',
    //         posterUrl: '/maxresdefault.jpg',
    //         rating: '9/10',
    //         college: 'DAIICT',
    //         date: '10 Nov, 2024',
    //     },
    // ];

    const tags = [{ label: 'DAIICT' }, { label: 'NIFT' }, { label: 'PDEU' }, { label: 'Nirma' }, { label: 'Nirma' }, { label: 'Nirma' }, { label: 'Nsahckacioehne' }, { label: 'Nirma' }];
    const types = [{ label: 'Concert' }, { label: 'Coding' }, { label: 'Sports' }];

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
        setSelectedTags([]);
        setSelectedTypes([]);
    };

    useEffect(()=>{
        console.log("events", events);
    },[events])


    return (
        <div className="bg-black-800 text-white min-h-screen">
            <Navbar />
            {/* <div className="h-[92px]"></div> */}
            <Banner />

            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold">Filters</h2>
                </div>

                <div className="flex space-x-4 mb-8">

                    <div className="relative">
                        <button
                            onClick={() => setIsTagOpen(!isTagOpen)}
                            className="text-left px-4 py-2 w-[250px] bg-gray-700 text-white font-semibold rounded-lg"
                        >
                            Tags
                        </button>
                        {isTagOpen && (
                            <div className="absolute mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                                <div className="px-4 py-2 space-x-2 flex flex-wrap">
                                    {tags.map((tag) => (
                                        <label
                                            key={tag.label}
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag.label)}
                                                onChange={() => toggleSelection(setSelectedTags, selectedTags, tag.label)}
                                                className="form-checkbox h-4 w-4 text-red-500"
                                            />
                                            <span className="text-sm">{tag.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>



                    <div className="relative">
                        <button
                            onClick={() => setIsTypeOpen(!isTypeOpen)}
                            className="text-left px-4 py-2 w-[250px] bg-gray-700 text-white font-semibold rounded-lg"
                        >
                            Types
                        </button>
                        {isTypeOpen && (
                            <div className="absolute mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-lg z-10">
                                <div className="px-4 py-2 space-x-2 flex flex-wrap">
                                    {types.map((type) => (
                                        <label
                                            key={type.label}
                                            className="flex text-left items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type.label)}
                                                onChange={() => toggleSelection(setSelectedTypes, selectedTypes, type.label)}
                                                className="form-checkbox text-left h-4 w-4 text-red-500"
                                            />
                                            <span className="text-sm">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                        Clear All Filters
                    </button>
                </div>
            </section>

            <label className="mx-[140px] w-[515px] px-3 py-2 mr-6 border rounded-md flex items-center gap-2 bg-gray-700 text-white">
                <input
                    type="search"
                    className="w-full h-full px-4 py-2 h-6 border-none bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
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

            <section className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-semibold mb-6">Events Starting Soon</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {events.map((event, index) => (
                        <div key={index} className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                            <Link to="/register-for-event">
                                <img
                                    className="w-full h-72 object-cover"
                                    src={event.poster}
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

            <Footer />
        </div>
    );
}

