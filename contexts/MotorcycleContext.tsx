'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchMotorcycle } from '../config/api';
import { addFavoriteMotorcycle, removeFavoriteMotorcycle, getFavoriteMotorcycles } from '../services/motorcycleService';
import type { Motorcycle, FavoriteMotorcycle } from '../types/motorcycle';

interface MotorcycleContextType {
  motorcycle: Motorcycle | null;
  favorites: FavoriteMotorcycle[];
  isLoading: boolean;
  error: string | null;
  loadRandomMotorcycle: () => Promise<void>;
  toggleFavorite: (motorcycle: Motorcycle) => Promise<void>;
  isFavorite: (motorcycle: Motorcycle) => boolean;
}

const MotorcycleContext = createContext<MotorcycleContextType | undefined>(undefined);

export const useMotorcycle = () => {
  const context = useContext(MotorcycleContext);
  if (context === undefined) {
    throw new Error('useMotorcycle must be used within a MotorcycleProvider');
  }
  return context;
};

export const MotorcycleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMotorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRandomMotorcycle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const makes = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson'];
      const randomMake = makes[Math.floor(Math.random() * makes.length)];
      const data = await fetchMotorcycle(randomMake);
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setMotorcycle(data[randomIndex]);
      }
    } catch (err) {
      setError('Failed to fetch motorcycle data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = useCallback(async () => {
    if (user) {
      try {
        const userFavorites = await getFavoriteMotorcycles(user.uid);
        setFavorites(userFavorites);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, loadFavorites]);

  const toggleFavorite = async (moto: Motorcycle) => {
    if (!user) return;
    
    try {
      const existingFavorite = favorites.find(
        f => f.make === moto.make && f.model === moto.model
      );

      if (existingFavorite) {
        await removeFavoriteMotorcycle(existingFavorite.id);
        setFavorites(favorites.filter(f => f.id !== existingFavorite.id));
      } else {
        const newFavoriteId = await addFavoriteMotorcycle(moto, user.uid);
        setFavorites([...favorites, { ...moto, id: newFavoriteId, userId: user.uid, createdAt: new Date() }]);
      }
    } catch (err) {
      console.error('Failed to update favorites:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const isFavorite = (moto: Motorcycle) => {
    return favorites.some(f => f.make === moto.make && f.model === moto.model);
  };

  return (
    <MotorcycleContext.Provider
      value={{
        motorcycle,
        favorites,
        isLoading,
        error,
        loadRandomMotorcycle,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </MotorcycleContext.Provider>
  );
};
