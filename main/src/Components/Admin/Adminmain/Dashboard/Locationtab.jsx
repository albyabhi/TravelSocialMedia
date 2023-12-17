import React from 'react'

import { Box, Button, TextField } from '@mui/material'
import Sidenav from '../Dashboard/Sidenav'
import Navbar from '../Dashboard/Navbar'

const Locationtab = () => {
  return (
    <>

<Navbar/>
<Box height={30} />

     <Box sx={{ display: 'flex' }}>

    <Sidenav/>
  

    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

      <form>

    <h1>Add Location</h1>
   <h3>Nation</h3><TextField fullWidth label="Nation" id="Nation" />
   <h3>State</h3><TextField fullWidth label="State" id="State" />
   <h3>Location</h3><TextField fullWidth label="Location" id="Location" /><br></br>
   <h1></h1><Button variant="contained">ADD</Button>



    </form>
    </Box>
      </Box>
  </>
  )
}

export default Locationtab