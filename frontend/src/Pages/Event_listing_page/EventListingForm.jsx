import { useState } from 'react';
import './EventListing.scss'; // Ensure this file has updated styles for modern design.
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';

export const EventForm = () => {
  const [events, setEvents] = useState([]);

  const [formInput, setFormInput] = useState({
    eventName: '',
    description: '',
    price: '',
    registrationStartDate: '',
    registrationEndDate: '',
    startTime: '',
    endTime: '',
    type: '',
    tags: [],
    createdBy: '',
    occasion: '',
    mode: '',
    venue: '',
    pointOfContact: '',
    poster: null,
    contactPerson1Email: '',
    contactPerson1Phone: '',
    contactPerson2Email: '',
    contactPerson2Phone: '',
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

    const newEvent = { ...formInput };
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    const formData = new FormData();
    Object.keys(formInput).forEach((key) => {
      formData.append(key, key === 'tags' ? JSON.stringify(formInput[key]) : formInput[key]);
    });

    try {
      const response = await fetch("http://localhost:3000/api/event/listing", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log('Event submitted successfully');
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error("Error during event listing", error);
    }

    setFormInput({
      eventName: '',
      description: '',
      price: '',
      registrationStartDate: '',
      registrationEndDate: '',
      startTime: '',
      endTime: '',
      type: '',
      tags: [],
      createdBy: '',
      occasion: '',
      mode: '',
      venue: '',
      pointOfContact: '',
      poster: null,
      contactPerson1Email: '',
      contactPerson1Phone: '',
      contactPerson2Email: '',
      contactPerson2Phone: '',
    });

    console.log([...events,newEvent]);

    e.target.reset();
  };

  return (
    <div className="event-form-container">
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
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Description</label>
            <EventDescription
              description={formInput.description}
              onDescriptionChange={handleDescriptionChange}
            />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="0 for Free"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Registration & Timing</h2>
          <div className="form-group">
            <label>Registration Start Date</label>
            <input
              type="date"
              name="registrationStartDate"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Registration End Date</label>
            <input
              type="date"
              name="registrationEndDate"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event Start Time</label>
            <input
              type="time"
              name="startTime"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Event End Time</label>
            <input
              type="time"
              name="endTime"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Event Details</h2>
          <div className="form-group">
            <label>Event Type</label>
            <select name="type" onChange={handleInputChange} required>
              <option value="">Select Type</option>
              <option value="Cultural Event">Cultural Event</option>
              <option value="Technical Event">Technical Event</option>
              <option value="Sports Event">Sports Event</option>
              <option value="Social Event">Social Event</option>
              <option value="Concert">Concert</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <TagSelector selectedTags={formInput.tags} onTagChange={handleTagChange} />
          </div>

          <div className="form-group">
            <label>Created By</label>
            <input
              type="text"
              name="createdBy"
              placeholder="Enter Your Name"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Details</h2>
          <div className="form-group">
            <label>Contact Person 1 Email</label>
            <input
              type="email"
              name="contactPerson1Email"
              placeholder="Enter Email"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 1 Phone</label>
            <input
              type="tel"
              name="contactPerson1Phone"
              placeholder="Enter Phone Number"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 2 Email</label>
            <input
              type="email"
              name="contactPerson2Email"
              placeholder="Enter Email"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 2 Phone</label>
            <input
              type="tel"
              name="contactPerson2Phone"
              placeholder="Enter Phone Number"
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-group">
            <label>Mode of Event</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Online"
                  onChange={() => handleModeChange('Online')}
                />
                Online
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Offline"
                  onChange={() => handleModeChange('Offline')}
                />
                Offline
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Event Venue</label>
            <input
              type="text"
              name="venue"
              placeholder="Enter Venue"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Point of Contact</label>
            <input
              type="text"
              name="pointOfContact"
              placeholder="Main Point of Contact Name"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 1 Email</label>
            <input
              type="email"
              name="contactPerson1Email"
              placeholder="Enter Email"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 1 Phone</label>
            <input
              type="tel"
              name="contactPerson1Phone"
              placeholder="Enter Phone Number"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 2 Email</label>
            <input
              type="email"
              name="contactPerson2Email"
              placeholder="Enter Email"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person 2 Phone</label>
            <input
              type="tel"
              name="contactPerson2Phone"
              placeholder="Enter Phone Number"
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Upload Event Poster</label>
            <input type="file" name="poster" accept="image/*" onChange={handleFileChange} />
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
