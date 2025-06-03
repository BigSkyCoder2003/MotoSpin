"use client";

import { Container, Box, Typography, Button, Grid, SxProps, Theme } from '@mui/material';
import { Shuffle } from '@mui/icons-material';
import { useAuth } from "../contexts/AuthContext";
import { useMotorcycle } from "../contexts/MotorcycleContext";
import { ProtectedRoute, AuthForm } from "../components/auth";
import { MotorcycleCard } from "../components/motorcycle/MotorcycleCard";
import { APP_NAME, APP_DESCRIPTION } from "../utils/constants";

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
  } = useMotorcycle();

  const containerSx: SxProps<Theme> = { py: 4 };
  const titleBoxSx: SxProps<Theme> = { textAlign: 'center', mb: 6 };
  const mainTitleSx: SxProps<Theme> = { mb: 2, fontWeight: 700 };
  const buttonContainerSx: SxProps<Theme> = { display: 'flex', justifyContent: 'center', mb: 4 };
  const authBoxSx: SxProps<Theme> = { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: 3 
  };

  return (
    <Container maxWidth="lg" sx={containerSx}>
      <Box sx={titleBoxSx}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={mainTitleSx}
        >
          🏍️ {APP_NAME}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {APP_DESCRIPTION}
        </Typography>
      </Box>

      <ProtectedRoute 
        fallback={
          <Box sx={authBoxSx}>
            <Typography variant="h5" color="text.secondary" textAlign="center">
              Sign in to save your favorite motorcycles
            </Typography>
            <AuthForm />
          </Box>
        }
      >
        <Box>
          <Box sx={buttonContainerSx}>
            <Button
              variant="contained"
              size="large"
              onClick={loadRandomMotorcycle}
              startIcon={<Shuffle />}
              disabled={isLoading}
            >
              Spin for a Random Motorcycle
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
            </Box>
          )}

          {favorites.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Your Favorites
              </Typography>
              <Grid container spacing={3}>
                {favorites.map((favorite) => (
                  <Grid {...gridItemProps} key={favorite.id}>
                    <MotorcycleCard
                      motorcycle={favorite}
                      isFavorite={true}
                      onToggleFavorite={() => toggleFavorite(favorite)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </ProtectedRoute>
    </Container>
  );
}
