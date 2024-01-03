import { Box } from '@mui/material';
import React from 'react';
import UserWidget from './Widgets/UserWidget';

const Sidebar = () => {
  return (
    <Box flex={1} padding={1}
     // Adjust padding as needed
      sx={{ display: { xs: "none", sm: "block" } }}
    >
      <UserWidget />
    </Box>
  );
};

export default Sidebar;
