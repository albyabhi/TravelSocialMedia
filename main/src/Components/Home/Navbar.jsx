import React, { useState } from 'react';
import styled from '@emotion/styled';
import { AppBar, Badge, Box, InputBase, Toolbar, Typography } from '@mui/material';
import { PostAdd, Mail, Notifications } from '@mui/icons-material';
import AddPost from './Widgets/Addpost'; // Adjust the import path based on your project structure
import { CenteredContainer } from './Props/CenteredContainer'; // Create a CenteredContainer styled component

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  margin: 0, // Remove margin
  padding: '0 16px', // Add padding if needed
}));

const SearchContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // Use secondary color
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

  const toggleAddPost = () => {
    setAddPostVisibility((prevVisibility) => !prevVisibility);
  };
  const closeAddPost = () => {
    setAddPostVisibility(false);
  };

  return (
    <>
      <AppBar position="sticky">
        <StyledToolbar>
          <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
            NomadGram
          </Typography>
          <SearchContainer>
            <InputBase placeholder="Search" />
          </SearchContainer>
          <Icons>
            <PostAdd fontSize="large" color="black" onClick={toggleAddPost} />
            <Badge badgeContent={4} color="error">
              <Mail />
            </Badge>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </Icons>
        </StyledToolbar>
      </AppBar>
      {isAddPostVisible && (
        <CenteredContainer>
          <AddPost onClose={closeAddPost} />
        </CenteredContainer>
      )}
    </>
  );
};

export default Navbar;
