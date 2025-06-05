'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Favorite,
  Shuffle,
  Logout,
  Login,
  Home,
  Close
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useMotorcycle } from '../../contexts/MotorcycleContext';

interface NavbarProps {
  onSpinMotorcycle?: () => void;
  onToggleFavorites?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSpinMotorcycle, onToggleFavorites }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { favorites, loadRandomMotorcycle } = useMotorcycle();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSpinMotorcycle = () => {
    if (onSpinMotorcycle) {
      onSpinMotorcycle();
    } else {
      loadRandomMotorcycle();
    }
    setMobileMenuOpen(false);
  };

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
    >
      {user && (
        <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
          <Typography variant="subtitle1" fontWeight="600">
            {user.displayName || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      )}
      <Divider />
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Sign out
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          pt: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
        <Typography variant="h6" fontWeight="600">
          Menu
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
      
      <List>
        <ListItem component="button" onClick={() => setMobileMenuOpen(false)}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        
        {user && (
          <>
            <ListItem component="button" onClick={handleSpinMotorcycle}>
              <ListItemIcon>
                <Shuffle />
              </ListItemIcon>
              <ListItemText primary="Spin Motorcycle" />
            </ListItem>
            
            <ListItem component="button" onClick={() => { onToggleFavorites?.(); setMobileMenuOpen(false); }}>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText 
                primary="Favorites" 
                secondary={favorites.length > 0 ? `${favorites.length} saved` : 'None saved'} 
              />
            </ListItem>
          </>
        )}
      </List>
      
      {user && (
        <>
          <Divider sx={{ mt: 2 }} />
          <Box sx={{ px: 2, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {user.photoURL ? (
                <Avatar src={user.photoURL} sx={{ width: 40, height: 40 }} />
              ) : (
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                  {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </Avatar>
              )}
              <Box>
                <Typography variant="subtitle2" fontWeight="600">
                  {user.displayName || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Sign out
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              🏍️ MotoSpin
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Button
                    startIcon={<Shuffle />}
                    onClick={handleSpinMotorcycle}
                    sx={{ textTransform: 'none' }}
                  >
                    Spin
                  </Button>
                  
                  <Button
                    startIcon={<Favorite />}
                    onClick={onToggleFavorites}
                    sx={{ textTransform: 'none' }}
                  >
                    Favorites ({favorites.length})
                  </Button>

                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    {user.photoURL ? (
                      <Avatar 
                        src={user.photoURL} 
                        sx={{ width: 36, height: 36 }} 
                      />
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          bgcolor: 'primary.main',
                          fontSize: '1rem'
                        }}
                      >
                        {(user.displayName?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                      </Avatar>
                    )}
                  </IconButton>
                </>
              ) : (
                <Button
                  startIcon={<Login />}
                  variant="contained"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              onClick={handleToggleMobileMenu}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {renderProfileMenu}
      {renderMobileMenu}
    </>
  );
};

export default Navbar;
