import { Link } from 'react-router-dom';

import {React} from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Banner from "./Banner";
import EventCard from "./Event_Card";

export const Home = () => {
  return (
    <>
      <Navbar/>
      <div className='m-[67px]'></div>
      <Banner/>
      <EventCard title="Recommended Events"/>
      <EventCard title="Events Happening Near You"/>
      <Footer />
    </>
  );
}

