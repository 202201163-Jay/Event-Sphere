import React, { useState, useEffect } from 'react';
import './EventListing.scss';
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';
import axios from "axios";
const userId = localStorage.getItem("userId");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
// import client from '../axioscalls/api'

export const EventForm = () => {
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('');
  const [event, setEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { isEdit } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit !== '0') {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/event/${isEdit}`);
          const eventData = response.data;
          setEvent(eventData);
          setTags(eventData.tags || []);
          setDescription(eventData.description || '');
          setMode(eventData.mode || '');
          setImageUrl(eventData.poster || '');
        } catch (error) {
          toast.error('Error fetching event details');
        }
      };
      fetchEventDetails();
    }
  }, [isEdit]);

  const handleTagChange = (selectedTags) => setTags(selectedTags);
  const handleDescriptionChange = (desc) => setDescription(desc);

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const newdata={
    //   id,tags,description,
    // }
    
    const formData = new FormData(e.target);
    formData.append("tags", JSON.stringify(tags)); 
    formData.append("description", description); 
    formData.append("clubId", userId);
    console.log(formData)
    
    try {
      const url = isEdit === '0' ? "http://localhost:3000/api/event/listing" : `http://localhost:3000/api/event/update/${isEdit}`;
      const method = isEdit === '0' ? "POST" : "PUT";
      
      const response = await axios.put(url,formData,{
        // method: method,
        // body:JSON.stringify(formData),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        toast.error("Event could not be updated");
      } else {
        toast.success(isEdit === '0' ? "Event submitted successfully" : "Event updated successfully");
        setTimeout(() => {
          navigate("/club-profile");
        }, 1000);
      }
    } catch (error) {
      console.error("Error during event submission", error);
      toast.error("Error during event submission");
    }
  };

  

  return (
    <div className="event-form-container">
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="event-form">
        <h1 className="form-header">{isEdit === '0' ? 'Create a New Event' : 'Edit Event'}</h1>

        <div className="form-section">
          <h2>Basic Details</h2>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="eventName"
              placeholder="Enter Event Title"
              defaultValue={event?.eventName || ''}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 'bold', fontSize: '2.3vh', color: '#f1c40f' }}>Event Description</label>
            <EventDescription onDescriptionChange={handleDescriptionChange} />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="0 for Free"
              defaultValue={event?.price || ''}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Registration & Timing</h2>
          <div className="form-group">
            <label>Registration Start Date</label>
            <input type="date" name="registrationStartDate" defaultValue={event?.registrationStartDate || ''} required />
          </div>

          <div className="form-group">
            <label>Registration End Date</label>
            <input type="date" name="registrationEndDate" defaultValue={event?.registrationEndDate || ''} required />
          </div>

          <div className="form-group">
            <label>Event Start Time</label>
            <input type="time" name="startTime" defaultValue={event?.startTime || ''} required />
          </div>

          <div className="form-group">
            <label>Event End Time</label>
            <input type="time" name="endTime" defaultValue={event?.endTime || ''} required />
          </div>
        </div>

        <div className="form-section">
          <h2>Event Details</h2>
          <div className="form-group">
            <label>Event Type</label>
            <select name="type" defaultValue={event?.type || ''} required>
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
              defaultValue={event?.venue || ''}
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
            <input type="text" name="createdBy" placeholder="Enter Your Name" defaultValue={event?.createdBy || ''} required />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Details</h2>
          <div className="form-group">
            <label>Contact Person 1 Email</label>
            <input className="text-black" type="email" name="contactPersonEmail" placeholder="Enter Email" defaultValue={event?.contactPersonEmail || ''} required />
          </div>

          <div className="form-group">
            <label>Contact Person 1 Phone</label>
            <input className="text-black" type="tel" name="contactPersonPhone" placeholder="Enter Phone Number" defaultValue={event?.contactPersonPhone || ''} required />
          </div>
          
          {isEdit === '0' && (
            <div className="form-group">
              <label>Upload Event Poster</label>
              <input type="file" name="poster" accept="image/*" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEdit === '0' ? 'Submit Event' : 'Update Event'}
          </button>
        </div>
      </form>
    </div>
  );
};