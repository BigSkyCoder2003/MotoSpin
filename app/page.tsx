"use client";

import { useState } from 'react';
import { Container, Box, Typography, Button, Grid, SxProps, Theme } from '@mui/material';
import { Shuffle } from '@mui/icons-material';
import { useAuth } from "../contexts/AuthContext";
import { useMotorcycle } from "../contexts/MotorcycleContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthForm from "../components/auth/AuthForm";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseApp from "../lib/firebase";
import { MotorcycleCard } from "../components/motorcycle/MotorcycleCard";
import { Navbar } from "../components";

const gridItemProps = {
  item: true,
  xs: 12,
  sm: 6,
  md: 4
} as const;

export default function Home() {
  const { user } = useAuth();
  const { 
    motorcycle, 
    favorites, 
    isLoading, 
    error,
    loadRandomMotorcycle,
    toggleFavorite,
    isFavorite
  } = useMotorcycle();  const [localShowFavorites, setLocalShowFavorites] = useState(false);
  
  const currentShowFavorites = localShowFavorites;
  const currentToggleFavorites = () => setLocalShowFavorites(!localShowFavorites);

  const handleGoogleSignIn = async () => {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };
  const handleToggleFavorites = () => {
    currentToggleFavorites();
  };
  const handleSpinMotorcycle = () => {
    setLocalShowFavorites(false);
    loadRandomMotorcycle();
  };

  const containerSx: SxProps<Theme> = { py: 4, minHeight: 'calc(100vh - 64px)' };
  const welcomeBoxSx: SxProps<Theme> = { textAlign: 'center', mb: 4 };
  const buttonContainerSx: SxProps<Theme> = { display: 'flex', justifyContent: 'center', mb: 4 };
  const googleButtonSx: SxProps<Theme> = { 
    py: 1.5, 
    px: 4, 
    borderRadius: 3,
    textTransform: 'none',
    fontSize: '1.1rem'
  };
  const authBoxSx: SxProps<Theme> = { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: 3 
  };  return (
    <>
      <Navbar 
        onSpinMotorcycle={handleSpinMotorcycle}
        onToggleFavorites={handleToggleFavorites}
      />
      <Container maxWidth="lg" sx={containerSx}>
      <ProtectedRoute 
        fallback={
          <Box sx={authBoxSx}>
              <Box sx={welcomeBoxSx}>
                <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
                  Welcome to MotoSpin
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Sign in to discover random motorcycles and save your favorites
                </Typography>
              </Box>
              <AuthForm />
            </Box>
          }        >
          <Box>
            {user && !currentShowFavorites && (
              <Box sx={welcomeBoxSx}>
                <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
                  Welcome back, {user.displayName || 'Rider'}! 🏍️
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Ready to discover some amazing motorcycles?
                </Typography>
              </Box>            )}

            {currentShowFavorites ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Your Favorite Motorcycles
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleToggleFavorites}
                    sx={{ textTransform: 'none' }}
                  >
                    Back to Discover
                  </Button>
                </Box>
                
                {favorites.length > 0 ? (
                  <Grid container spacing={3}>
                    {favorites.map((favorite) => (
                      <Grid {...gridItemProps} key={favorite.id}>
                        <MotorcycleCard
                          motorcycle={favorite}
                          isFavorite={true}
                          onToggleFavorite={() => toggleFavorite(favorite)}
                          startCollapsed={true}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      No favorites yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Start spinning to discover motorcycles and add them to your favorites!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleToggleFavorites}
                      startIcon={<Shuffle />}
                    >
                      Start Discovering
                    </Button>
                  </Box>
                )}              </Box>
            ) : (
              <Box>
                <Box sx={buttonContainerSx}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={loadRandomMotorcycle}
                    startIcon={<Shuffle />}
                    disabled={isLoading}
                    sx={{ 
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      textTransform: 'none'
                    }}
                  >
                    {isLoading ? 'Spinning...' : 'Spin for a Random Motorcycle'}
                  </Button>
                </Box>

                {error && (
                  <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                {motorcycle && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MotorcycleCard
                      motorcycle={motorcycle}
                      isFavorite={isFavorite(motorcycle)}
                      onToggleFavorite={() => toggleFavorite(motorcycle)}
                    />
                  </Box>                )}

                {favorites.length > 0 && (
                  <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      You have {favorites.length} favorite motorcycle{favorites.length !== 1 ? 's' : ''}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleToggleFavorites}
                      sx={{ textTransform: 'none' }}
                    >
                      View All Favorites
                    </Button>
                  </Box>
                )}
              </Box>
            )}</Box></ProtectedRoute>
      </Container>
    </>
  );
}
