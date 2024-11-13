import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import EventCard from "../Home/Event_Card.jsx";
import Banner from "../Home/Banner.jsx";

export const Register_For_Event = () => {
    const events = [
        {
          name: 'Synapse',
          posterUrl: '/maxresdefault.jpg',
          rating: '9/10',
          college: 'DAIICT',
          date: '10 Nov, 2024',
            },
        ];

    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        const footer = document.getElementById('footer');
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Check if the footer is within view
        setIsFooterVisible(footerTop <= windowHeight);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
    <div className="bg-white text-white min-h-screen">
        <Navbar/>
        <div className="h-[100px]"></div>

        {/* Event Banner */}
        <div className="relative w-full overflow-hidden mr-8">
            {events.map((event,index) => (
                <div className="text-gray-800 pl-5 pr-5 text-3xl font-bold">
                    <h1>{event.name}</h1>
                    <div className="h-[30px]"></div>
                    <a href="#" className="bg-gray-200">
                        <img
                            src={`https://via.placeholder.com/1200x400?text=${event.posterUrl}`}
                            alt={`Banner ${event.name}`}
                            className="w-full h-[350px] block rounded-xl"
                        />
                    </a>
                    <div className="flex m-3 space-x-2">
                        <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-md">{event.college}</span>
                        <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-md">{event.date}</span>
                    </div>

                    <span className="flex items-center justify-between bg-white p-3 rounded-md mb-3">
                        <div className="p-3 bg-gray-100 flex items-center rounded-xl">
                            <p className="text-xl">Rating</p>
                            <span className="w-12"></span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 text-red-500 mr-2"
                            >
                                <path d="M12 .587l3.668 7.568L24 9.75l-6 5.84L19.33 24 12 20.115 4.67 24 6 15.59 0 9.75l8.332-1.595z" />
                            </svg>
                            <span className="text-lg font-semibold text-gray-800">{event.rating}</span>
                            {/* <span className="text-sm text-gray-500 ml-2">({movie.votes})</span> */}
                        </div>
                    </span>
                </div>
            ))}
        </div>

        <div className="mt-24 ml-12 mr-12 mb-24 h-[1000px] text-black"><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis totam fuga cum doloribus, hic dolor! Assumenda, libero quod magnam quas dolorem debitis, velit quis aliquam facilis incidunt esse pariatur a.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint iste itaque, amet a reprehenderit asperiores dignissimos eos quaerat vitae sunt optio, assumenda, doloribus quidem architecto illum autem magni! Dolorum!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ab consequuntur amet molestias, quod cumque, magni beatae nam et, mollitia rem. Maxime, nulla distinctio officia ducimus dolore quod? Voluptatem, error.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis totam fuga cum doloribus, hic dolor! Assumenda, libero quod magnam quas dolorem debitis, velit quis aliquam facilis incidunt esse pariatur a.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint iste itaque, amet a reprehenderit asperiores dignissimos eos quaerat vitae sunt optio, assumenda, doloribus quidem architecto illum autem magni! Dolorum!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ab consequuntur amet molestias, quod cumque, magni beatae nam et, mollitia rem. Maxime, nulla distinctio officia ducimus dolore quod? Voluptatem, error.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis totam fuga cum doloribus, hic dolor! Assumenda, libero quod magnam quas dolorem debitis, velit quis aliquam facilis incidunt esse pariatur a.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint iste itaque, amet a reprehenderit asperiores dignissimos eos quaerat vitae sunt optio, assumenda, doloribus quidem architecto illum autem magni! Dolorum!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ab consequuntur amet molestias, quod cumque, magni beatae nam et, mollitia rem. Maxime, nulla distinctio officia ducimus dolore quod? Voluptatem, error.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis totam fuga cum doloribus, hic dolor! Assumenda, libero quod magnam quas dolorem debitis, velit quis aliquam facilis incidunt esse pariatur a.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint iste itaque, amet a reprehenderit asperiores dignissimos eos quaerat vitae sunt optio, assumenda, doloribus quidem architecto illum autem magni! Dolorum!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ab consequuntur amet molestias, quod cumque, magni beatae nam et, mollitia rem. Maxime, nulla distinctio officia ducimus dolore quod? Voluptatem, error.
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis totam fuga cum doloribus, hic dolor! Assumenda, libero quod magnam quas dolorem debitis, velit quis aliquam facilis incidunt esse pariatur a.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint iste itaque, amet a reprehenderit asperiores dignissimos eos quaerat vitae sunt optio, assumenda, doloribus quidem architecto illum autem magni! Dolorum!
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam ab consequuntur amet molestias, quod cumque, magni beatae nam et, mollitia rem. Maxime, nulla distinctio officia ducimus dolore quod? Voluptatem, error.</p>
        </div>

        {/* Event Description */}
        <div className={`${isFooterVisible ? 'absolute bottom-0' : 'fixed bottom-0'} 
        bottom-6 right-5 left-5 bg-gray-300 h-24 shadow-lg py-4 flex justify-between 
        items-center px-6 rounded-xl`}
        >
            {events.map((event,index) => (
                <div className="text-black text-3xl">
                <p>{event.name}</p>
                </div>
            ))}
            <button className="bg-indigo-500 h-12 text-white py-2 px-4 rounded-lg">Register for Event</button>
        </div>

        <footer id="footer">
            <Footer/>
        </footer>
    </div>
  );
};
