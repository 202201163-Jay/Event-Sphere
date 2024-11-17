import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Home/Navbar.jsx";
import Footer from "../Home/Footer.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
 
export const Payment = () => {
    const { id } = useParams(); // Extract the event ID from the URL
    const [event, setEvent] = useState(null);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const userId = Cookies.get("userId");
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
          const footer = document.getElementById("footer");
          const footerTop = footer.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          setIsFooterVisible(footerTop <= windowHeight);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
          try {
            const response = await fetch(`http://localhost:3000/api/event/${id}`); // Replace with your API URL
            const data = await response.json();
            setEvent(data);
          } catch (error) {
            console.error("Failed to fetch event", error);
          }
        };
    
        if (id) {
          fetchEvent();
        }
      }, [id]);

    const handleClick = async () => {
        try {
          console.log("H");
          const response = await fetch(`http://localhost:3000/api/event/hi/${id}/${userId}`);
          console.log(response);
          const data = await response.json(); // Parse response body once
          if (response.ok) {
              toast.success("Registered Successfully!!");
              console.log("Y");
              setTimeout(() => {
                navigate(`/event/${id}`);
              }, 3000);
          } else {
            // Handle non-OK responses
            console.log("Error response:", data);
            toast.error(data.message || "Registration Unsuccessful");
          }
        } catch (err) {
          console.error("Error during registration:", err);
          toast.error(err.message || "An unexpected error occurred");
        }
      };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="h-screen bg-white">
        <div className="flex justify-center mt-5 mb-6">
            <button className="bg-blue-500 mt-[500px] text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-400 transition-all"     
            onClick={()=>handleClick()}>
            Pay for Event
            </button>
        </div>
      </div>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  )
}
