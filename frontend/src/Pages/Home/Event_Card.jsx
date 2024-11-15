import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';

const EventCard = ({ title }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const url = title === "Latest Event"
          ? "http://localhost:3000/api/home/latestevent"
          : "http://localhost:3000/api/home/trendingevent";

        const results = await axios.get(url);
        
        const eventData = title === "Latest Event"
          ? results.data.latestevent
          : results.data.trendingEvents;

        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    getAllEvents();
  }, [title]);

  useEffect(() => {
    console.log("events", events);
  }, [events]);

  return (
    <section className="p-5">
      <h2 className="text-3xl font-semibold mt-12 mb-5 ml-2 text-left text-white">
        {title}
      </h2>
      <div className="flex justify-between" style={{ gap: '15px' }}>
        {events?.map((event, index) => (
          <div key={index}>
            <Card event={event} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventCard;
