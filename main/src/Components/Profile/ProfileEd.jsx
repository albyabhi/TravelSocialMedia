// ProfileEd.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileEd = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('');
  const [highlightedPlaces, setHighlightedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the stored token from local storage
        const token = localStorage.getItem('token');

        // If the token is not available, navigate to the login page
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user data from the protected profile endpoint
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: token },
        });

        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error.response.data.message);

        // If there's an error, navigate to the login page
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  const handleProfilePictureChange = (event) => {
    // Handle profile picture file change
    const file = event.target.files[0];
    setProfilePicture(file);
  };

  const handleBioChange = (event) => {
    // Handle bio textarea change
    setBio(event.target.value);
  };

  const handleAddPlace = () => {
    // Handle adding a highlighted place
    const newPlace = prompt('Enter a place:');
    if (newPlace) {
      setHighlightedPlaces([...highlightedPlaces, newPlace]);
    }
  };

  const handleSubmitChanges = async () => {
    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
      formData.append('bio', bio);
      formData.append('highlightedPlaces', JSON.stringify(highlightedPlaces));
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phoneNumber', phoneNumber);

      // Send a POST request to update the profile
      await axios.post('http://localhost:5000/api/profile/update', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Optionally, you can fetch the updated user data and update the state
      // This step depends on your backend's behavior

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response.data.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {userData.username}!</h2>

      {/* First Name */}
<label>
  First Name:
  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
</label>

{/* Last Name */}
<label>
  Last Name:
  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
</label>

{/* Phone Number */}
<label>
  Phone Number:
  <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
</label>


      {/* Profile Picture */}
      <label>
        Profile Picture:
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      </label>

      {/* Bio */}
      <label>
        Bio:
        <textarea value={bio} onChange={handleBioChange} />
      </label>

      {/* Highlighted Places */}
      <div>
        <h3>Highlighted Places:</h3>
        <ul>
          {highlightedPlaces.map((place, index) => (
            <li key={index}>{place}</li>
          ))}
        </ul>
        <button onClick={handleAddPlace}>Add Place</button>
      </div>

      {/* Submit button */}
      <button onClick={handleSubmitChanges}>Save Changes</button>

      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileEd;
