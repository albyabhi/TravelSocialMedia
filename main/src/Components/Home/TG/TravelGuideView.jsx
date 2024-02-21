import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Avatar } from '@mui/material';

const TravelGuideView = () => {
  const { guideId, userId } = useParams(); // Updated line
  const [travelGuide, setTravelGuide] = useState(null);
 
  console.log('id', guideId); // Updated line
  useEffect(() => {
    const fetchTravelGuide = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tg/fetchById/${guideId}`); // Updated line
        setTravelGuide(response.data.travelGuide);
        console.log(response)
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

  return (
    <Container>
      {/* Display Feature Destination */}
      <Box my={4}>
        {featureDestination && (
          <>
            <Typography variant="h4">{featureDestination.name}</Typography>
            <Typography variant="body1">{featureDestination.description}</Typography>
            {featureDestination.image && featureDestination.image.contentType && featureDestination.image.data && (
              <Avatar alt={featureDestination.name} src={`data:${featureDestination.image.contentType};base64,${featureDestination.image.data}`} />
            )}
          </>
        )}
      </Box>

      {/* Display Itinerary */}
      <Box>
        {itinerary && Object.keys(itinerary).map((dayKey) => (
          <Box key={dayKey} my={4}>
            <Typography variant="h5">Day {dayKey}</Typography>
            {itinerary[dayKey].map((destination, index) => (
              <Box key={index} my={2}>
                <Typography variant="subtitle1">{destination.description}</Typography>
                {destination.image && destination.image.contentType && destination.image.data && (
                  <Avatar alt={`Destination ${index + 1}`} src={`data:${destination.image.contentType};base64,${destination.image.data}`} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default TravelGuideView;
