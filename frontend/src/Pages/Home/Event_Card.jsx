import React from 'react';

const EventCard = ({ title }) => {
  return (
    <section className="p-5">
      <h2 className="text-2xl mb-5 font-bold text-center text-indigo-500">{title}</h2>
      <div className="flex justify-between" style={{ gap: '15px' }}>
        <div className="w-[30%] bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <a href="#" className="link">
            <img src="#" alt="Event 1" className="w-full h-[400px] object-cover" />
          </a>
          <div className="p-3 bg-gray-200">
            <h3 className="text-xl mb-2">Event Title 1</h3>
            <p className="text-sm text-gray-500">Location</p>
          </div>
        </div>
        <div className="w-[30%] bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <a href="#" className="link">
            <img src="#" alt="Event 2" className="w-full h-[400px] object-cover" />
          </a>
          <div className="p-3 bg-gray-200">
            <h3 className="text-xl mb-2">Event Title 2</h3>
            <p className="text-sm text-gray-500">Location</p>
          </div>
        </div>
        <div className="w-[30%] bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <a href="#" className="link">
            <img src="#" alt="Event 3" className="w-full h-[400px] object-cover" />
          </a>
          <div className="p-3 bg-gray-200">
            <h3 className="text-xl mb-2">Event Title 3</h3>
            <p className="text-sm text-gray-500">Location</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCard;