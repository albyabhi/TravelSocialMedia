// Navbar.js
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { AppBar, Badge, Box, InputBase, Toolbar, Typography } from '@mui/material';
import { PostAdd, AccountCircle , Search as SearchIcon } from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddPost from './Widgets/Addpost';
import { CenteredContainer } from './Props/CenteredContainer';
import ProfileEdWidget from './Widgets/ProfileEdWidget'; // Adjust the import path as needed
import { useMediaQuery } from '@mui/material';
import { useNavigate , Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  margin: 0,
  padding: '0 16px',
}));

const SearchContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '0 10px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
}));

const Icons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  },
}));

const Navbar = () => {
  const [isAddPostVisible, setAddPostVisibility] = useState(false);
  const [isProfileWidgetVisible, setProfileWidgetVisibility] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const toggleAddPost = () => {
    setAddPostVisibility((prevVisibility) => !prevVisibility);
  };

  const toggleProfileWidget = () => {
    setProfileWidgetVisibility((prevVisibility) => !prevVisibility);
  };

  const closeAddPost = () => {
    setAddPostVisibility(false);
  };

 

 

  const handleSearchClick = () => {
    // Navigate to the Search page when the search icon is clicked
    navigate('/search');
    // Pass the search query to the Search page
    
  };

  
  const handleLocationClick = () => {
    // Navigate to the TravelGuideAdd page when the location icon is clicked
    navigate('/TravelGuideAdd');
  };

  

  return (
    <>
      <AppBar position="sticky">
        <StyledToolbar>
        <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
              NomadGram
            </Typography>
          </Link>
          <SearchContainer>
            <InputBase
              placeholder="Search"
              onClick={handleSearchClick}
              endAdornment={
                <IconButton onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              }
            />
          </SearchContainer>
          <Icons>
            {isMobile && (
              <AccountCircle fontSize="large" color="black" onClick={toggleProfileWidget} />
            )}
             <IconButton onClick={toggleAddPost}>
              <PostAdd fontSize="large" color="black" />
            </IconButton>
            <IconButton aria-label="Location" onClick={handleLocationClick}>
              <LocationOnIcon fontSize="large" color="black" />
            </IconButton>
          </Icons>
        </StyledToolbar>
      </AppBar>
      {isAddPostVisible && (
        <CenteredContainer>
          <AddPost onClose={closeAddPost} />
        </CenteredContainer>
      )}
      {isProfileWidgetVisible && (
        <CenteredContainer>
       <ProfileEdWidget onClose={toggleProfileWidget} />
       </CenteredContainer>     
      )}

    </>
  );
};

export default Navbar;
