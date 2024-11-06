import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Col_Reg = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailDomain: '',
  });
  const [representatives, setRepresentatives] = useState([]);
  const [error, setError] = useState('');
  const [repError, setRepError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRepChange = (index, e) => {
    const { name, value } = e.target;
    const newRepresentatives = [...representatives];
    newRepresentatives[index][name] = value;
    setRepresentatives(newRepresentatives);
  };

  const addRepresentative = () => {
    const lastRep = representatives[representatives.length - 1];

    if (representatives.length > 0 && (!lastRep.repname || !lastRep.repId || !lastRep.password)) {
      setRepError('Please fill out all fields for the current representative.');
    } else {
      setRepError('');
      if (representatives.length < 10) {
        setRepresentatives([...representatives, { repname: '', repId: '', password: '' }]);
      } else {
        alert('You can add a maximum of 10 representatives.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const incompleteRep = representatives.some(rep => !rep.repname || !rep.repId || !rep.password);
    if (incompleteRep) {
      setRepError('Please fill in all fields for each representative before submitting.');
      return;
    }
  
    const dataToSubmit = {
      name: formData.collegeName,
      email: formData.email,
      password: formData.password,
      emailDomain: formData.emailDomain,
      collegeRepresentatives: representatives.map(rep => ({
        repname: rep.repname,
        repId: rep.repId,
        password: rep.password,
      })),
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/college-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong');
        console.log('Error:', errorData);
      } else {
        const responseData = await response.json();
        setError('');
        console.log('Form Submitted:', responseData);
  
        setFormData({
          collegeName: '',
          email: '',
          password: '',
          confirmPassword: '',
          emailDomain: '',
        });
        setRepresentatives([{ repname: '', repId: '', password: '' }]);
  
        navigate("/");
      }
    } catch (error) {
      console.log('Network error:', error);
    }
  };
  

  return (
    <div className="w-full px-10 h-screen flex justify-center items-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mt-4">Join us</h2>
          <h2 className="text-2xl font-bold">Boost your Events</h2>
          <h3 className="mt-2">Be a part of a constantly growing community.</h3>
        </div>

        <div className="overflow-y-auto max-h-[75vh] p-4 border rounded-lg">
          <form className="w-full" onSubmit={handleSubmit}>
            <input
              className="w-full p-2 border rounded mb-4"
              type="text"
              name="collegeName"
              placeholder="Enter Your College Name"
              value={formData.collegeName}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-full p-2 border rounded mb-4"
              type="email"
              name="email"
              placeholder="Enter Your College Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-full p-2 border rounded mb-4"
              type="password"
              name="password"
              placeholder="Create a Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <input
              className="w-full p-2 border rounded mb-4"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            {error && <p className="text-red-500 mb-4 flex justify-center">{error}</p>}
            <input
              className="w-full p-2 border rounded mb-4"
              type="text"
              name="emailDomain"
              placeholder="Enter Your College Email Domain"
              value={formData.emailDomain}
              onChange={handleInputChange}
              required
            />

            {representatives.map((rep, index) => (
              <div key={index} className="w-full mb-4">
                <input
                  className="w-full p-2 border rounded mb-2"
                  type="text"
                  name="repname"
                  placeholder="Representative Name"
                  value={rep.repname}
                  onChange={(e) => handleRepChange(index, e)}
                  required
                />
                <input
                  className="w-full p-2 border rounded mb-2"
                  type="text"
                  name="repId"
                  placeholder="Representative ID"
                  value={rep.repId}
                  onChange={(e) => handleRepChange(index, e)}
                  required
                />
                <input
                  className="w-full p-2 border rounded mb-2"
                  type="password"
                  name="password"
                  placeholder="Representative Password"
                  value={rep.password}
                  onChange={(e) => handleRepChange(index, e)}
                  required
                />
              </div>
            ))}

            {repError && <p className="text-red-500 mb-4 flex justify-center">{repError}</p>}

            <div className="flex justify-center mb-4">
              {representatives.length < 10 && (
                <button
                  type="button"
                  onClick={addRepresentative}
                  className="w-1/2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Add Representative
                </button>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                style={{ fontWeight: '800' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-4">
          <h3>
            Already have an account? <a className="text-blue-500 hover:underline " href="/college-login">Log In</a>
          </h3>
        </div>
      </div>
    </div>
  );
};
