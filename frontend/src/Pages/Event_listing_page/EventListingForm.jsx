import React, { useState } from 'react';
import './EventListing.scss';
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';
import axios from "axios";
import Cookies from "js-cookie"
const userId = Cookies.get("userId");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';

export const EventForm = () => {
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState(''); // Added state for mode
  const navigate = useNavigate()

  const handleTagChange = (selectedTags) => setTags(selectedTags);
  const handleDescriptionChange = (desc) => setDescription(desc);

  const handleModeChange = (event) => {
    setMode(event.target.value); // Update mode based on selected radio button
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    formData.append("tags", JSON.stringify(tags)); 
    formData.append("description", description); 
    formData.append("clubId", userId);
    
    try {
      await axios.post("http://localhost:3000/api/event/listing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event submitted successfully");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Error during event listing", error);
    }
  };

  return (
    <div className="event-form-container">
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="event-form">
        <h1 className="form-header">Create a New Event</h1>

        <div className="form-section">
          <h2>Basic Details</h2>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="eventName"
              placeholder="Enter Event Title"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Description</label>
            <EventDescription onDescriptionChange={handleDescriptionChange} />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="0 for Free"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Registration & Timing</h2>
          <div className="form-group">
            <label>Registration Start Date</label>
            <input type="date" name="registrationStartDate" required />
          </div>

          <div className="form-group">
            <label>Registration End Date</label>
            <input type="date" name="registrationEndDate" required />
          </div>

          <div className="form-group">
            <label>Event Start Time</label>
            <input type="time" name="startTime" required />
          </div>

          <div className="form-group">
            <label>Event End Time</label>
            <input type="time" name="endTime" required />
          </div>
        </div>

        <div className="form-section">
          <h2>Event Details</h2>
          <div className="form-group">
            <label>Event Type</label>
            <select name="type" required>
              <option value="">Select Type</option>
              <option value="Competition">Competition</option>
              <option value="Concert">Concert</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Venue</label>
            <input
              type="text"
              name="venue"
              placeholder="Enter Venue"
              required
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <TagSelector selectedTags={tags} onTagChange={handleTagChange} />
          </div>

          <div className="form-group">
            <label>Mode of Event</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Online"
                  checked={mode === "Online"}
                  onChange={handleModeChange}
                />
                Online
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Offline"
                  checked={mode === "Offline"}
                  onChange={handleModeChange}
                />
                Offline
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Created By</label>
            <input type="text" name="createdBy" placeholder="Enter Your Name" required />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Details</h2>
          <div className="form-group">
            <label>Contact Person 1 Email</label>
            <input className="text-black" type="email" name="contactPersonEmail" placeholder="Enter Email" required />
          </div>

          <div className="form-group">
            <label>Contact Person 1 Phone</label>
            <input className="text-black" type="tel" name="contactPersonPhone" placeholder="Enter Phone Number" required />
          </div>

          <div className="form-group">
            <label>Upload Event Poster</label>
            <input type="file" name="poster" accept="image/*" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Event
          </button>
        </div>
      </form>
    </div>
  );
};