import React, { useState } from 'react';
import './otp.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState('');

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("Entered OTP: ", enteredOtp);

    if (enteredOtp === "123456") {
      setMessage("OTP Verified Successfully!");
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit} className="otp-form">
        {otp.map((value, index) => (
          <input
            type="text"
            name="otp"
            maxLength="1"
            key={index}
            value={value}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
            className="otp-input"
          />
        ))}
      </form>
      <div id="buttons">
            <button type="submit" className="submit-button">Verify OTP</button>
            <button type="resend" className="resend-button">Resend OTP</button>
        </div>
      {message && <p className="otp-message">{message}</p>}
    </div>
  );
};

export default OTPVerification;
