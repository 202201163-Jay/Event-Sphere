import { useState } from 'react'
import './App.scss'
import TagSelector from './tagSelector'
import EventDescription from './eventDescription';

function EventForm() {

  const [events, setEvents] = useState([]);

  const [formInput, setFormInput] = useState({
    type: '',
    title: '',
    organizer: '',
    occasion: '',
    mode: '',
    tags: [],
    description: '',
    registrationStartDate: '',
    registrationEndDate: '',
    venue: '',
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

  const handleSubmit = (e) => {

    e.preventDefault();

    const newEvent = {
      type: e.target.elements["event-type"].value,
      title: e.target.elements.title.value,
      organizer: e.target.elements.organizer.value,
      occasion: e.target.elements.occasion.value,
      mode: formInput.mode,
      tags: formInput.tags,
      description: formInput.description,
      registrationStartDate: formInput.registrationStartDate,
      registrationEndDate: formInput.registrationEndDate,
      venue: formInput.venue,
      poster: formInput.poster
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    setFormInput({
      type: '',
      title: '',
      organizer: '',
      occasion: '',
      mode: '',
      tags: [],
      description: '',
      registrationStartDate: '',
      registrationEndDate: '',
      venue: '',
      poster: null
    });

    e.target.reset();

    console.log("Events:", [...events, newEvent]);
  };
  
  return (
    <>
      <div className="event-form-main-container">

        <form onSubmit={handleSubmit}>

        <h1>Event Details</h1>

        <div className="event-input">

          {/*---------------- Event Type ------------------- */}
          <div className="event-type">

          <h4>Event Type</h4>

          <select name="event-type" id="event-type" required>
            <option value="Cultural Event">Cultural Event</option>
            <option value="Technical Event">Technical Event</option>
            <option value="Sports Event">Sports Event</option>
            <option value="Social Event">Social Event</option>
            <option value="concert">Concert</option>
          </select>
          </div>

          <div className="event-poster">
              <h4>Event Poster</h4>
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

          {/*---------------- Event Title ------------------- */}
          <div className="event-name">

            <h4>Event Title</h4>
            <input 
            type="text" 
            name="title" 
            placeholder="Enter Event Title (max 100 characters)" 
            required 
            />

          </div>

          <div className="event-organizer">

            <h4>Enter Your Organization name</h4>
            <input 
            type="text" 
            name="organizer" 
            placeholder="Enter Organizer Name" 
            required 
            />
          </div>

          <div className="event-occasion">
            <h4>Festival (optional)</h4>
            <h6>In case this event is part of a festival/campaign.</h6>
            <input 
            type="text" 
            name="occasion" 
            placeholder="Enter Festival Name" 
            />
          </div>

          {/* Registration Start Date */}
          <div className="registration-start-date">
              <h4>Registration Start Date</h4>
              <input
                type="date"
                name="registrationStartDate"
                value={formInput.registrationStartDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Registration End Date */}
            <div className="registration-end-date">
              <h4>Registration End Date</h4>
              <input
                type="date"
                name="registrationEndDate"
                value={formInput.registrationEndDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Event Venue */}
            <div className="event-venue">
              <h4>Event Venue</h4>
              <input
                type="text"
                name="venue"
                placeholder="Enter Venue Location"
                value={formInput.venue}
                onChange={handleInputChange}
                required
              />
            </div>

          <div className="mode-of-event">
            <h4>Mode of Event</h4>
            
            <div className="mode-buttons">

            <button type="button" 
            onClick={() => handleModeChange('Online')}>
              Online Mode
            </button>

            <button 
            type="button" 
            onClick={() => handleModeChange('Offline')}>
              Offline Mode
            </button>

            </div>
          </div>

          <div className="event-category">
            <h4>Tags For Event</h4>
            <TagSelector  selectedTags={formInput.tags} onTagChange={handleTagChange} ></TagSelector>
          </div>

        </div>

        <div className="event-description">
        <EventDescription  description={formInput.description} onDescriptionChange={handleDescriptionChange}></EventDescription>
        </div>

        <div className="submit-button">
        <button type="submit">Create Event</button>
        </div>

        </form>


      </div>
    </>
  )
}

export default EventForm
