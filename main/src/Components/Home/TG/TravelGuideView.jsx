import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../Navbar';

const TravelGuideView = () => {
  const { guideId } = useParams();
  const [travelGuide, setTravelGuide] = useState(null);
  const [showImageId, setShowImageId] = useState(null);

  useEffect(() => {
    const fetchTravelGuide = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tg/fetchById/${guideId}`);
        setTravelGuide(response.data.travelGuide);
      } catch (error) {
        console.error('Error fetching travel guide:', error);
      }
    };

    fetchTravelGuide();
  }, [guideId]);

  if (!travelGuide) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const { featureDestination, itinerary } = travelGuide;

  const handleShowImage = (locationId) => {
    setShowImageId(prevState => (prevState === locationId ? null : locationId));
  };

  return (
    <div>
      <Navbar />
      <Container>
        {/* Display Feature Destination */}
        <Box my={4} bgcolor="secondary.main" borderRadius={8} p={4} display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            {featureDestination && (
              <>
                <Typography variant="h4">{featureDestination.name}</Typography>
                <Typography variant="body1" mb={2}>{featureDestination.description}</Typography>
              </>
            )}
          </Box>
          {featureDestination && featureDestination.image && featureDestination.image.contentType && featureDestination.image.data && (
            <img
              alt={featureDestination.name}
              src={`data:${featureDestination.image.contentType};base64,${featureDestination.image.data}`}
              style={{ borderRadius: '10px' }} // Adjust border radius here
              onError={(e) => { e.target.onerror = null; e.target.src = 'image-not-available.png'; }}
            />
          )}
        </Box>

        {/* Display Itinerary */}
        <Box>
          {itinerary && Object.keys(itinerary).map((dayKey) => (
            <Box key={dayKey} my={4} bgcolor="#f0f0f0" borderRadius={8} p={2}>
              <Typography variant="h5">{dayKey}</Typography>
              {itinerary[dayKey].map((destination, index) => (
                <Box key={index} my={2} bgcolor="secondary.main" borderRadius={8} p={2} display="flex" flexDirection="column">
                  <Typography variant="subtitle1">Destination {index + 1}</Typography>
                  <Typography variant="h6">Name: {destination.name}</Typography>
                  <Typography variant="body1">Description: {destination.description}</Typography>
                  <Typography variant="body1">Transportation: {destination.transportation}</Typography>
                  <Typography variant="body1">Visiting Duration: {destination.visitingDuration}</Typography>
                  <Typography variant="body1">Visiting Time: {destination.visitingTime}</Typography>
                  <Typography variant="body1" style={{ cursor: 'pointer', textDecoration: 'underline', color: 'grey' }} onClick={() => handleShowImage(destination.location_id)}>
                    {showImageId === destination.location_id ? 'Hide Image' : 'Show Image'}
                  </Typography>                  {showImageId === destination.location_id && (
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
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default TravelGuideView;
