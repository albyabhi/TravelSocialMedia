import React from 'react';
import UserWidget from './Widgets/UserWidget';
import { Box } from '@mui/material';

const Sidebar = () => {
  return (
    <Box
      flex={1}
      padding={1}
      // Adjust padding as needed
      sx={{
        display: { xs: 'none', sm: 'block' },
        position: 'sticky',
        top: '4rem', 
        alignSelf: 'flex-start', 
      }}
    >
      <UserWidget />
    </Box>
  );
};

export default Sidebar;
