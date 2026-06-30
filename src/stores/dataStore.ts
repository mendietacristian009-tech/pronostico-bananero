import { create } from 'zustand';
import { Facility, BoxRecord, Forecast } from '../types/data';

const initialFacilities: Facility[] = [];

const getInitialBoxRecords = () => {
  const records: BoxRecord[] = [];
  return records;
};

const getInitialForecasts = () => {
  const forecasts: Forecast[] = [];
  return forecasts;
};

interface DataState {
  facilities: Facility[];
  boxRecords: BoxRecord[];
  forecasts: Forecast[];
  loading: boolean;
  error: string | null;
}

export const useDataStore = create<DataState & {
  fetchFacilities: () => Promise<void>;
  fetchBoxRecords: () => Promise<void>;
  fetchForecasts: () => Promise<void>;
  addBoxRecord: (record: Omit<BoxRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateForecastActual: (forecastId: string, actualBoxes: number) => Promise<void>;
  addFacility: (facility: Omit<Facility, 'id' | 'createdAt'>) => Promise<void>;
  updateFacility: (id: string, updates: Partial<Omit<Facility, 'id' | 'createdAt'>>) => Promise<void>;
}>((set) => ({
  facilities: [],
  boxRecords: [],
  forecasts: [],
  loading: false,
  error: null,

  fetchFacilities: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ facilities: initialFacilities, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar las empacadoras', loading: false });
    }
  },

  fetchBoxRecords: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ boxRecords: getInitialBoxRecords(), loading: false });
    } catch (error) {
      set({ error: 'Error al cargar los registros de cajas', loading: false });
    }
  },

  fetchForecasts: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      set({ forecasts: getInitialForecasts(), loading: false });
    } catch (error) {
      set({ error: 'Error al cargar los pronosticos', loading: false });
    }
  },

  addBoxRecord: async (record) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const newRecord: BoxRecord = {
        ...record,
        id: `record-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        boxRecords: [...state.boxRecords, newRecord],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al anadir el registro', loading: false });
    }
  },

  updateForecastActual: async (forecastId, actualBoxes) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => {
        const forecast = state.forecasts.find(f => f.id === forecastId);
        if (!forecast) {
          throw new Error('Forecast not found');
        }

        const accuracy = Math.round((1 - Math.abs(forecast.predictedBoxes - actualBoxes) / actualBoxes) * 100);

        const updatedForecasts = state.forecasts.map(f =>
          f.id === forecastId
            ? { ...f, actualBoxes, accuracy, updatedAt: new Date().toISOString() }
            : f
        );

        return { forecasts: updatedForecasts, loading: false };
      });
    } catch (error) {
      set({ error: 'Error al actualizar el pronostico', loading: false });
    }
  },

  addFacility: async (facility) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const newFacility: Facility = {
        ...facility,
        id: `facility-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      set(state => ({
        facilities: [...state.facilities, newFacility],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Error al anadir la empacadora', loading: false });
    }
  },

  updateFacility: async (id, updates) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => {
        const updatedFacilities = state.facilities.map(f =>
          f.id === id ? { ...f, ...updates } : f
        );

        return { facilities: updatedFacilities, loading: false };
      });
    } catch (error) {
      set({ error: 'Error al actualizar la empacadora', loading: false });
    }
  },
}));
