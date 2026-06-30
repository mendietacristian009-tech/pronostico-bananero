import { MembershipFunction } from "../types/fuzzyTypes";

// Triangle membership function
export const triangleMF = (x: number, a: number, b: number, c: number): number => {
  if (x <= a) return 0;
  if (x <= b) return (x - a) / (b - a);
  if (x <= c) return (c - x) / (c - b);
  return 0;
};

// Trapezoidal membership function
export const trapezoidMF = (x: number, a: number, b: number, c: number, d: number): number => {
  if (x <= a) return 0;
  if (x <= b) return (x - a) / (b - a);
  if (x <= c) return 1;
  if (x <= d) return (d - x) / (d - c);
  return 0;
};

// Define membership functions for each input
export const loadMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 3),
  medium: (x: number) => triangleMF(x, 2, 5, 6),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

export const dirtMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 3),
  medium: (x: number) => triangleMF(x, 2, 5, 6),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

export const fabricMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 3),
  medium: (x: number) => triangleMF(x, 2, 5, 6),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

// Define membership functions for output variables
export const timeMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 5),
  medium: (x: number) => triangleMF(x, 3, 5, 7),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

export const speedMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 5),
  medium: (x: number) => triangleMF(x, 3, 5, 7),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

export const waterMF: MembershipFunction = {
  low: (x: number) => triangleMF(x, 0, 0, 5),
  medium: (x: number) => triangleMF(x, 3, 5, 7),
  high: (x: number) => triangleMF(x, 5, 10, 10)
};

// Helper function to get linguistic term for output value
export const getLinguisticTerm = (value: number): string => {
  if (value < 3.5) return "Bajo";
  if (value < 6.5) return "Medio";
  return "Alto";
};

// Function to get correct Spanish term based on the variable and value
export const getSpanishTerm = (variable: string, value: string): string => {
  if (variable === 'load') {
    if (value === 'low') return 'Baja';
    if (value === 'medium') return 'Media';
    if (value === 'high') return 'Alta';
  }
  
  if (variable === 'dirt') {
    if (value === 'low') return 'Limpio';
    if (value === 'medium') return 'Medio';
    if (value === 'high') return 'Sucio';
  }
  
  if (variable === 'fabric') {
    if (value === 'low') return 'Delicada';
    if (value === 'medium') return 'Normal';
    if (value === 'high') return 'Gruesa';
  }
  
  if (variable === 'time' || variable === 'water') {
    if (value === 'low') return 'Bajo';
    if (value === 'medium') return 'Medio';
    if (value === 'high') return 'Alto';
  }
  
  if (variable === 'speed') {
    if (value === 'low') return 'Baja';
    if (value === 'medium') return 'Media';
    if (value === 'high') return 'Alta';
  }
  
  return value;
};