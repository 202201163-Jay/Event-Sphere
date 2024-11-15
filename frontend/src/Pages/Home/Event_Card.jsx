import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Card from '../../components/Card';

const EventCard = ({ title }) => {

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

    useEffect(()=>{
      console.log("events", events);
  },[events])


  return (

    <section className="p-5">
      <h2 className="text-3xl font-semibold  mt-12 mb-5 ml-2 text-left text-white">Hello</h2>
      <div className="flex justify-between" style={{ gap: '15px' }}>
      {events?.map((event, index)=>(
        <div key={index}>
          <Card event={event}/>
        </div>
      ))}
      </div>
    </section>
  );
};

export default EventCard;