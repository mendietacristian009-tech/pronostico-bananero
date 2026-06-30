import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PackingFacility, Forecast } from '../types';
import { generateMockData } from '../utils/mockData';

interface DataContextType {
  facilities: PackingFacility[];
  forecasts: Forecast[];
  addFacility: (facility: Omit<PackingFacility, 'id' | 'createdAt'>) => void;
  updateFacility: (id: string, facility: Partial<PackingFacility>) => void;
  updateActualProduction: (forecastId: string, actualBoxes: number) => void;
  generateForecast: (facilityId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<PackingFacility[]>(generateMockData().facilities);
  const [forecasts, setForecasts] = useState<Forecast[]>(generateMockData().forecasts);

  const addFacility = (facility: Omit<PackingFacility, 'id' | 'createdAt'>) => {
    const newFacility: PackingFacility = {
      ...facility,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setFacilities(prev => [...prev, newFacility]);
  };

  const updateFacility = (id: string, updates: Partial<PackingFacility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const updateActualProduction = (forecastId: string, actualBoxes: number) => {
    setForecasts(prev => prev.map(f => {
      if (f.id === forecastId) {
        const accuracy = ((1 - Math.abs(f.forecastedBoxes - actualBoxes) / f.forecastedBoxes) * 100);
        return { ...f, actualBoxes, accuracy };
      }
      return f;
    }));
  };

  const generateForecast = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    const currentDate = new Date();
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekNumber = Math.ceil(((nextWeek.getTime() - new Date(nextWeek.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
    
    // Simple forecast algorithm based on historical average with some variation
    const baseProduction = 800 + Math.random() * 400; // 800-1200 boxes base
    const seasonalFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1 seasonal variation
    const forecastedBoxes = Math.round(baseProduction * seasonalFactor);

    const newForecast: Forecast = {
      id: Date.now().toString(),
      facilityId: facility.id,
      facilityName: facility.name,
      week: weekNumber,
      year: nextWeek.getFullYear(),
      weekStart: new Date(nextWeek.getTime() - (nextWeek.getDay() * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      weekEnd: new Date(nextWeek.getTime() + ((6 - nextWeek.getDay()) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      forecastedBoxes,
      createdAt: new Date().toISOString()
    };

    setForecasts(prev => [...prev, newForecast]);
  };

  return (
    <DataContext.Provider value={{
      facilities,
      forecasts,
      addFacility,
      updateFacility,
      updateActualProduction,
      generateForecast
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}