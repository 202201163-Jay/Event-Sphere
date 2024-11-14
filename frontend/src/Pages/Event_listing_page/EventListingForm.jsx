import { useState } from 'react';
import './EventListing.scss';
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';

export const EventForm = () => {
  const [events, setEvents] = useState([]);

 const [formInput, setFormInput] = useState({
    type: '',
    eventName: '',
    organizer: '',
    occasion: '',
    mode: '',
    tags: [],
    description: '',
    registrationStartDate: '',
    registrationEndDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    price: '',
    poster: null
  });

  const handleModeChange = (mode) => {
    setFormInput((prevInput) => ({ ...prevInput, mode }));
  };

  const handleTagChange = (tags) => {
    setFormInput((prevInput) => ({ ...prevInput, tags }));
  };

  const handleDescriptionChange = (description) => {
    setFormInput((prevInput) => ({ ...prevInput, description }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormInput((prevInput) => ({ ...prevInput, poster: file }));
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      type: e.target.elements["event-type"].value,
      eventName: e.target.elements.eventName.value,
      organizer: e.target.elements.organizer.value,
      occasion: e.target.elements.occasion.value,
      mode: formInput.mode,
      tags: formInput.tags,
      description: formInput.description,
      registrationStartDate: formInput.registrationStartDate,
      registrationEndDate: formInput.registrationEndDate,
      startTime: formInput.startTime,
      endTime: formInput.endTime,
      venue: formInput.venue,
      price: formInput.price,
      poster: formInput.poster
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    const formData = new FormData(); // Collect form data from the target (the form itself)
    formData.append('type', formInput.type);
    formData.append('eventName', formInput.eventName);
    formData.append('organizer', formInput.organizer);
    formData.append('occasion', formInput.occasion);
    formData.append('mode', formInput.mode);
    formData.append('tags', JSON.stringify(formInput.tags)); // Converting tags array to a string
    formData.append('description', formInput.description);
    formData.append('registrationStartDate', formInput.registrationStartDate);
    formData.append('registrationEndDate', formInput.registrationEndDate);
    formData.append('startTime', formInput.startTime);
    formData.append('endTime', formInput.endTime);
    formData.append('venue', formInput.venue);
    formData.append('price', formInput.price);
    if (formInput.poster) {
      formData.append('poster', formInput.poster);
    }

    try {
      const response = await fetch("http://localhost:3000/api/event/listing", {
        method: "POST",
        body: formData, // Send the form data as multipart/form-data
      });

      if (response.ok) {
        const responsedata = await response.json();
        console.log(responsedata);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error("Error during event listing", error);
    }

    console.log([...events,newEvent]);

    // Reset the form and state
    setFormInput({
      type: '',
      eventName: '',
      organizer: '',
      occasion: '',
      mode: '',
      tags: [],
      description: '',
      registrationStartDate: '',
      registrationEndDate: '',
      startTime: '',
      endTime: '',
      venue: '',
      price: '',
      poster: null
    });

    e.target.reset();
  };

  return (
    <div className="event-form-main-container">
      <form onSubmit={handleSubmit}>
        <h1>Event Details</h1>
        <div className="event-input">

          <div className="event-type">
            <h4>Event Type</h4>
            <select name="type" id="event-type" required>
              <option value="Cultural Event">Cultural Event</option>
              <option value="Technical Event">Technical Event</option>
              <option value="Sports Event">Sports Event</option>
              <option value="Social Event">Social Event</option>
              <option value="Concert">Concert</option>
            </select>
          </div>

          <div className="event-poster">
            <h4>Event Poster</h4>
            <input type="file" name="poster" accept="image/*" onChange={handleFileChange}/>
          </div>

          <div className="event-name">
            <h4>Event Title</h4>
            <input type="text" name="eventName" placeholder="Enter Event Title (max 100 characters)" required />
          </div>

          <div className="event-organizer">
            <h4>Enter Your Organization name</h4>
            <input type="text" name="organizer" placeholder="Enter Organizer Name" required />
          </div>

          <div className="event-occasion">
            <h4>Festival (optional)</h4>
            <input type="text" name="occasion" placeholder="Enter Festival Name" />
          </div>

          <div className="registration-start-date">
            <h4>Registration Start Date</h4>
            <input type="date" name="registrationStartDate" onChange={handleInputChange} required />
          </div>

          <div className="registration-end-date">
            <h4>Registration End Date</h4>
            <input type="date" name="registrationEndDate" onChange={handleInputChange} required />
          </div>

          <div className="event-start-time">
            <h4>Event Start Time</h4>
            <input type="time" name="startTime" onChange={handleInputChange} required />
          </div>

          <div className="event-end-time">
            <h4>Event End Time</h4>
            <input type="time" name="endTime" onChange={handleInputChange} required />
          </div>

          <div className="event-price">
            <h4>Event Price</h4>
            <input type="number" name="price" placeholder="Enter Price (0 if free)" onChange={handleInputChange} required />
          </div>

          <div className="event-venue">
            <h4>Event Venue</h4>
            <input type="text" name="venue" placeholder="Enter Venue Location" onChange={handleInputChange} required />
          </div>

          <div className="mode-of-event">
            <h4>Mode of Event</h4>
            <div className="mode-buttons">
              <button type="button" onClick={() => handleModeChange('Online')}>Online Mode</button>
              <button type="button" onClick={() => handleModeChange('Offline')}>Offline Mode</button>
            </div>
          </div>

          <div className="event-category">
            <h4>Tags For Event</h4>
            <TagSelector selectedTags={formInput.tags} onTagChange={handleTagChange} />
          </div>

          <div className="event-description">
            <EventDescription description={formInput.description} onDescriptionChange={handleDescriptionChange} />
          </div>

          <div className="submit-button">
            <button type="submit">Create Event</button>
          </div>
        </div>
      </form>
    </div>
  );
}
