import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { AddLocationAlt, FlagCircle } from '@mui/icons-material';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../appStore';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const open = useAppStore((state) => state.dopen);

  const [selectedItem, setSelectedItem] = React.useState(null);

  React.useEffect(() => {
    // Update selected item when location changes
    const pathname = location.pathname;
    switch (pathname) {
      case '/admindashboard':
        setSelectedItem('User Details');
        break;
      case '/location':
        setSelectedItem('Add Location');
        break;
      case '/viewedit':
        setSelectedItem('Country');
        break;
      case '/state':
        setSelectedItem('State');
        break;
      default:
        setSelectedItem(null);
        break;
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30} />
      <CustomDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton >
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        <ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/admindashboard")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: selectedItem === 'User Details' ? '#e0e0e0' : 'transparent',
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      <PersonIcon />
    </ListItemIcon>
    <ListItemText primary='User Details' sx={{ opacity: open ? 1 : 0, color: selectedItem === 'User Details' ? 'blue' : 'inherit' }} />
  </ListItemButton>
</ListItem>

<ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/location")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: selectedItem === 'Add Location' ? '#e0e0e0' : 'transparent',
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      <AddLocationAlt />
    </ListItemIcon>
    <ListItemText primary='Add Location' sx={{ opacity: open ? 1 : 0, color: selectedItem === 'Add Location' ? 'blue' : 'inherit' }} />
  </ListItemButton>
</ListItem>

<ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/viewedit")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: selectedItem === 'Country' ? '#e0e0e0' : 'transparent',
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      <PublicIcon />
    </ListItemIcon>
    <ListItemText primary='Country' sx={{ opacity: open ? 1 : 0, color: selectedItem === 'Country' ? 'blue' : 'inherit' }} />
  </ListItemButton>
</ListItem>

<ListItem disablePadding sx={{ display: 'block' }} onClick={() => navigate("/state")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
      backgroundColor: selectedItem === 'State' ? '#e0e0e0' : 'transparent',
    }}
  >
    <ListItemIcon
      sx={{
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
      }}
    >
      <FlagCircle />
    </ListItemIcon>
    <ListItemText primary='State' sx={{ opacity: open ? 1 : 0, color: selectedItem === 'State' ? 'blue' : 'inherit' }} />
  </ListItemButton>
</ListItem>

          {/* Other list items follow the same pattern */}
        </List>
        <Divider />
      </CustomDrawer>
    </Box>
  );
}
