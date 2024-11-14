import { useState } from 'react';
import './App.scss';
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';

export const EventForm = () => {
  const [events, setEvents] = useState([]);

  const handleModeChange = (mode) => {
    setEvents((prevEvents) => [...prevEvents, { mode }]);
  };

  const handleTagChange = (tags) => {
    setEvents((prevEvents) => [...prevEvents, { tags }]);
  };

  const handleDescriptionChange = (description) => {
    setEvents((prevEvents) => [...prevEvents, { description }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target); // Collect form data from the target (the form itself)

    try {
      const response = await fetch("http://localhost:3000/api/event/listing", {
        method: "POST",
        body: formdata, // Send the form data as multipart/form-data
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

    // Reset the form and state
    setEvents((prevEvents) => [...prevEvents, formdata]);
    e.target.reset(); // Reset the form fields after submission
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
            <input type="file" name="poster" accept="image/*" />
          </div>

          <div className="event-name">
            <h4>Event Title</h4>
            <input type="text" name="title" placeholder="Enter Event Title (max 100 characters)" required />
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
            <input type="date" name="registrationStartDate" required />
          </div>

          <div className="registration-end-date">
            <h4>Registration End Date</h4>
            <input type="date" name="registrationEndDate" required />
          </div>

          <div className="event-venue">
            <h4>Event Venue</h4>
            <input type="text" name="venue" placeholder="Enter Venue Location" required />
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
            <TagSelector selectedTags={events.tags} onTagChange={handleTagChange} />
          </div>

          <div className="event-description">
            <EventDescription description={events.description} onDescriptionChange={handleDescriptionChange} />
          </div>

          <div className="submit-button">
            <button type="submit">Create Event</button>
          </div>
        </div>
      </form>
    </div>
  );
}

