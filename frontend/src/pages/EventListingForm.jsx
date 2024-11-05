import { useState } from 'react'
import './EventListingForm.scss'
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
    description: ''
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

  const handleSubmit = (e) => {

    e.preventDefault();

    const newEvent = {
      type: e.target.elements["event-type"].value,
      title: e.target.elements.title.value,
      organizer: e.target.elements.organizer.value,
      occasion: e.target.elements.occasion.value,
      mode: formInput.mode,
      tags: formInput.tags,
      description: formInput.description
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    setFormInput({
      type: '',
      title: '',
      organizer: '',
      occasion: '',
      mode: '',
      tags: [],
      description: ''
    });

    e.target.reset();

    console.log("Events:", [...events, newEvent]);
  };
  
  return (
    <>
      <div className="event-form-main-container">

        <form onSubmit={handleSubmit}>

        <h1>Basic Details</h1>

        <div className="event-input">

          {/*---------------- Event Type ------------------- */}
          <div className="event-type">

          <h4>Event Type</h4>

          <select name="event-type" id="event-type" required>
            <option value="General">General Competition</option>
            <option value="Hackathon">Coding Event</option>
            <option value="dance">Dance Competition</option>
            <option value="singing">Singing Competition</option>
            <option value="concert">Concert Event</option>
          </select>
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
