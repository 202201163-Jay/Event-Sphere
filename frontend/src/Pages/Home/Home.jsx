import { Link } from 'react-router-dom';

import {React} from "react";
import {Navbar} from "../Home/Navbar";
import {Footer} from "../Home/Footer";

export const Home = () => {
  return (
    <>
      <Navbar/>
      <div className='m-[67px]'></div>
      <Footer />
    </>
  );
}

