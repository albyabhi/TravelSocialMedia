import React from 'react'
import Sidenav from '../Dashboard/Sidenav'
import Navbar from '../Dashboard/Navbar'

import { Box } from '@mui/material'

const Users = () => {
  return (
    <>
<Navbar/>
<Box height={30} />
    
        <Box sx={{ display: 'flex' }}>

      <Sidenav/>
      
       

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>home</h1>
      
      </Box>
      </Box>
    </>
  )
}

export default Users
