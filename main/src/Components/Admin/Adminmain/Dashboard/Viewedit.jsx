import React from 'react'

import { Box } from '@mui/material'
import Sidenav from '../Dashboard/Sidenav'
import Navbar from '../Dashboard/Navbar'

const Viewedit = () => {
  return (
    <>


<Navbar/>
<Box height={30} />

   <Box sx={{ display: 'flex' }}>

<Sidenav/>


<Box component="main" sx={{ flexGrow: 1, p: 3 }}>

<h1>viewedit</h1>
</Box>
  </Box>
  </>
  )
}

export default Viewedit
