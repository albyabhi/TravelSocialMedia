import { Box } from '@mui/material'
import React from 'react'
import PostWidget from './Widgets/PostWidget'


const Feed = () => {
  return (
    <Box 
     flex={4}
    padding={2}
    >
    <PostWidget />
    </Box>
  )
}

export default Feed