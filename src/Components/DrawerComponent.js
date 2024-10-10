// DrawerComponent.js
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdvertisementIcon from '@mui/icons-material/AdUnits';
import NotificationIcon from '@mui/icons-material/Notifications';
import MembershipIcon from '@mui/icons-material/People';
import NewsIcon from '@mui/icons-material/Article';
import PaymentsIcon from '@mui/icons-material/MonetizationOn';
import MastersIcon from '@mui/icons-material/Build';
import ReportsIcon from '@mui/icons-material/Description';
import UsersIcon from '@mui/icons-material/PeopleAlt';
import SettingIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
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

  const drawerWidth = 240;

  const iconMapping = {
    Dashboard: <DashboardIcon />,
    Advertisement: <AdvertisementIcon />,
    Notification: <NotificationIcon />,
    Membership: <MembershipIcon />,
    News: <NewsIcon />,
    Payments: <PaymentsIcon />,
    Masters: <MastersIcon />,
    Reports: <ReportsIcon />,
    Users: <UsersIcon />,
    Setting: <SettingIcon />,
  };



const DrawerComponent = ({ open, handleDrawerClose }) => {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {['Dashboard', 'Advertisement', 'Notification', 'Membership', 'Request', 'Payments', 'Masters', 'Reports', 'Users', 'Setting'].map((text, index) => (
          // Wrap ListItemButton with Link
          <Link key={text} to={`/${text.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {iconMapping[text] || (index % 2 === 0 ? <InboxIcon /> : <MailIcon />)}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
       
    </Drawer>
  );
};

export default DrawerComponent;
