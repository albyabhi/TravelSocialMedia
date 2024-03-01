import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Avatar, Typography, Box, CircularProgress } from '@mui/material';
import Navbar from '../Navbar';
import { useNavigate } from "react-router-dom";
import locationAddform from '../LocationAddform'


import carIcon from '../Icons/car.png'
import busIcon from '../Icons/bus.png'
import trainIcon from '../Icons/train.png';
import bikeIcon from '../Icons/motorbike.png'
import planeIcon from '../Icons/plane.png'

const TravelGuideView = () => {
  const { guideId } = useParams();
  const [travelGuide, setTravelGuide] = useState(null);
  const [showImageId, setShowImageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [userId, setUserId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTravelGuideAndUserData = async () => {
      try {
        // Fetch travel guide data
        const response = await axios.get(`http://localhost:5000/tg/fetchById/${guideId}`);
        const travelGuideData = response.data.travelGuide;
        setTravelGuide(travelGuideData);
        setLoading(false);
        
        // Fetch user data if travel guide data is available
        if (travelGuideData) {
          const userResponse = await axios.get(`http://localhost:5000/api/user/${travelGuideData.userId}`);
          const userData = userResponse.data;
          
          setUserId(userData.userId);
          setUserName(userData.username);
        setProfilePicture(userData.profilePicture);
        }
      } catch (error) {
        console.error('Error fetching travel guide or user data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTravelGuideAndUserData();
  }, [guideId]);

 

  

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress style={{ color: 'black' }} size={40} />
      </Box>
    );
  }

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  if (!travelGuide) {
    return <Typography variant="h6">No travel guide found!</Typography>;
  }

  const { featureDestination, itinerary  } = travelGuide;

  const handleShowImage = (locationId) => {
    setShowImageId((prevId) => (prevId === locationId ? null : locationId));
  };

  const navigateToProfile = (userId) => {
    navigate(`/profileview/${userId}`); // Navigate to profile view
  };
  
  
  

  return (
    <div>
      <Navbar />
      <Container>
        {/* userdata */}
      <Box my={4} bgcolor="secondary.main" borderRadius={8} p={4} display="flex" alignItems="center" >
      {profilePicture && (
          <Avatar
            alt="Profile"
            
            src={`data:${profilePicture.contentType};base64,${profilePicture.data}`}
            sx={{
              width: '50px',
              height: '50px',
              marginRight: '16px',
              borderRadius: '50%', // Adjusted border radius
            }}
          />
        )}
        {userName && 
        <Typography
        onClick={() => navigateToProfile(userId)}
        variant="subtitle1"
        style={{ cursor: 'pointer' }}
      >
        {userName}
      </Typography>
         }

      </Box>
      

        {/* Display Feature Destination */}
        <Box my={4} bgcolor="secondary.main" borderRadius={8} p={4} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">{featureDestination.name}</Typography>
            <Typography variant="body1" mb={2}>{featureDestination.description}</Typography>
          </Box>
          {featureDestination.image && featureDestination.image.contentType && featureDestination.image.data && (
            <img
              alt={featureDestination.name}
              src={`data:${featureDestination.image.contentType};base64,${featureDestination.image.data}`}
              style={{ borderRadius: '10px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'image-not-available.png'; }}
            />
          )}
        </Box>

        {/* Display Itinerary */}
        {Object.keys(itinerary).map((dayKey) => (
          <Box key={dayKey} my={4} bgcolor="#f0f0f0" borderRadius={8} p={2}>
            <Typography variant="h5">{dayKey}</Typography>
            {itinerary[dayKey].map((destination, index) => (
              <Box key={index} my={2} bgcolor="secondary.main" borderRadius={8} p={2} display="flex" flexDirection="column">
                <Typography variant="subtitle1">Destination {index + 1}</Typography>
                <Typography variant="h6">Name: {destination.name}</Typography>
                <Typography variant="body1">Description: {destination.description}</Typography>
                <Typography variant="body1">
  Transportation :   
  {destination.transportation === 'car' && (
    <img 
      src={carIcon} 
      alt="Car Icon" 
      style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '4px' }} 
    />
  )}
  {destination.transportation === 'bus' && (
    <img 
      src={busIcon} 
      alt="Bus Icon" 
      style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '4px' }} 
    />
  )}
  {destination.transportation === 'train' && (
    <img 
      src={trainIcon} 
      alt="Train Icon" 
      style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '4px' }} 
    />
  )}
  {destination.transportation === 'bike' && (
    <img 
      src={bikeIcon} 
      alt="Bike Icon" 
      style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '4px' }} 
    />
  )}
  {destination.transportation === 'plane' && (
    <img 
      src={planeIcon} 
      alt="Plane Icon" 
      style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '4px' }} 
    />
  )}
</Typography>
                <Typography variant="body1">Visiting Duration: {destination.visitingDuration}</Typography>
                <Typography variant="body1">Visiting Time: {destination.visitingTime}</Typography>
                <Typography
                  variant="body1"
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'grey' }}
                  onClick={() => handleShowImage(destination.location_id)}
                >
                  {showImageId === destination.location_id ? 'Hide Image' : 'Show Image'}
                </Typography>
                {showImageId === destination.location_id && (
                  <img
                    src={`http://localhost:5000/map/location/image/${destination.location_id}`}
                    alt={`Destination ${index + 1}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'image-not-available.png'; }}
                    style={{ borderRadius: '8px', marginTop: '8px', maxWidth: '100%' }}
                  />
                )}
                {!destination.location_id && (
                  <Typography variant="body1">Location image not available</Typography>
                )}
                <Typography
                  component={Link}
                  to={`/LocationView/${destination.location_id}`}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'grey' }}
                >
                  Show Posts of this location
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Container>
    </div>
  );
};

export default TravelGuideView;
