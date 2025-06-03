'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchMotorcycle } from '../lib/api';
import { addFavoriteMotorcycle, removeFavoriteMotorcycle, getFavoriteMotorcycles } from '../services/motorcycleService';
import { MOTORCYCLE_MAKES } from '../utils/constants';
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
      
      const randomMake = MOTORCYCLE_MAKES[Math.floor(Math.random() * MOTORCYCLE_MAKES.length)];
      
      const currentYear = new Date().getFullYear();
      const minYear = 1970;
      const randomYear = Math.floor(Math.random() * (currentYear - minYear + 1)) + minYear;
      
      // Try to fetch motorcycles for the random make and year
      let data = await fetchMotorcycle(randomMake, undefined, randomYear);
      
      // If no data for the specific year, try just the make
      if (!data || data.length === 0) {
        data = await fetchMotorcycle(randomMake);
      }
      
      // If still no data, try a few more random makes with random years
      let attempts = 0;
      while ((!data || data.length === 0) && attempts < 3) {
        const anotherMake = MOTORCYCLE_MAKES[Math.floor(Math.random() * MOTORCYCLE_MAKES.length)];
        const anotherYear = Math.floor(Math.random() * (currentYear - minYear + 1)) + minYear;
        data = await fetchMotorcycle(anotherMake, undefined, anotherYear);
        
        // If no data for year, try just the make
        if (!data || data.length === 0) {
          data = await fetchMotorcycle(anotherMake);
        }
        attempts++;
      }
      
      if (!data || data.length === 0) {
        data = await fetchMotorcycle();
      }
      
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedMotorcycle = data[randomIndex];
        
        // Ensure all fields are properly set
        setMotorcycle({
          make: selectedMotorcycle.make || 'Unknown',
          model: selectedMotorcycle.model || 'Unknown',
          year: selectedMotorcycle.year || new Date().getFullYear(),
          type: selectedMotorcycle.type || 'N/A',
          displacement: selectedMotorcycle.displacement || 'N/A',
          engine: selectedMotorcycle.engine || 'N/A',
          power: selectedMotorcycle.power || 'N/A',
          torque: selectedMotorcycle.torque || 'N/A',
          compression: selectedMotorcycle.compression || 'N/A',
          bore_stroke: selectedMotorcycle.bore_stroke || 'N/A',
          valves_per_cylinder: selectedMotorcycle.valves_per_cylinder || 'N/A',
          fuel_system: selectedMotorcycle.fuel_system || 'N/A',
          fuel_control: selectedMotorcycle.fuel_control || 'N/A',
          ignition: selectedMotorcycle.ignition || 'N/A',
          lubrication: selectedMotorcycle.lubrication || 'N/A',
          cooling: selectedMotorcycle.cooling || 'N/A',
          gearbox: selectedMotorcycle.gearbox || 'N/A',
          transmission: selectedMotorcycle.transmission || 'N/A',
          clutch: selectedMotorcycle.clutch || 'N/A',
          frame: selectedMotorcycle.frame || 'N/A',
          front_suspension: selectedMotorcycle.front_suspension || 'N/A',
          front_wheel_travel: selectedMotorcycle.front_wheel_travel || 'N/A',
          rear_suspension: selectedMotorcycle.rear_suspension || 'N/A',
          rear_wheel_travel: selectedMotorcycle.rear_wheel_travel || 'N/A',
          front_tire: selectedMotorcycle.front_tire || 'N/A',
          rear_tire: selectedMotorcycle.rear_tire || 'N/A',
          front_brakes: selectedMotorcycle.front_brakes || 'N/A',
          rear_brakes: selectedMotorcycle.rear_brakes || 'N/A',
          total_weight: selectedMotorcycle.total_weight || 'N/A',
          seat_height: selectedMotorcycle.seat_height || 'N/A',
          total_height: selectedMotorcycle.total_height || 'N/A',
          total_length: selectedMotorcycle.total_length || 'N/A',
          total_width: selectedMotorcycle.total_width || 'N/A',
          ground_clearance: selectedMotorcycle.ground_clearance || 'N/A',
          wheelbase: selectedMotorcycle.wheelbase || 'N/A',
          fuel_capacity: selectedMotorcycle.fuel_capacity || 'N/A',
          starter: selectedMotorcycle.starter || 'N/A',
        });
      } else {
        setError('No motorcycle data available. Please try again.');
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
