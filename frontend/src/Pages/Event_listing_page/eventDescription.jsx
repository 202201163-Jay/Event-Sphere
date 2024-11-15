import React from 'react';
import ReactQuill from 'react-quill';
import './eventdescription.scss';
import 'react-quill/dist/quill.snow.css';


const EventDescription = ({ description, onDescriptionChange }) => {
  return (
    <div className='event-description'>
      <ReactQuill
        id="EventDescription"
        value={description}
        onChange={onDescriptionChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image']
          ],
        }}
        placeholder={`Guidelines:\n- Mention all the guidelines like eligibility, format, etc.\n- Inter-college team members allowed or not.\n- Inter-specialization team members allowed or not.\n- The number of questions/problem statements.\n- Duration of the rounds.\n\nRules:\n- Mention the rules of the competition.`}
      />
      <p style={{ fontSize: 'small', color: 'grey' }}>Minimum Word Limit: 500</p>
    </div>
  );
};

export default EventDescription;




// import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
// import './eventdescription.scss'
// import 'react-quill/dist/quill.snow.css';

// const EventDescription = ({ description, onDescriptionChange }) => {
//   const [text, setText] = useState('');

//   const handleTextChange = (value) => {
//     setText(value);
//   };

//   return (
//     <div className='event-description'>
//       <label htmlFor="EventDescription">
//         <strong>About Event</strong> <span style={{ color: 'red' }}>*</span>
//       </label>
//       <ReactQuill
//         id="EventDescription"
//         value={text}
//         onChange={handleTextChange}
//         modules={{
//           toolbar: [
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//             [{ 'indent': '-1'}, { 'indent': '+1' }],
//             [{ 'align': [] }],
//             ['link', 'image']
//           ],
//         }}
//         placeholder={`Guidelines:
// - Mention all the guidelines like eligibility, format, etc.
// - Inter-college team members allowed or not.
// - Inter-specialization team members allowed or not.
// - The number of questions/problem statements.
// - Duration of the rounds.

// Rules:
// - Mention the rules of the competition.`}
//       />
//       <p style={{ fontSize: 'small', color: 'grey' }}>Minimum Word Limit: 500</p>
//     </div>
//   );
// };

// export default EventDescription;
