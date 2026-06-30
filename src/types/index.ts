export interface User {
  id: string;
  username: string;
  role: 'admin' | 'engineer' | 'warehouse';
  name: string;
}

export interface PackingFacility {
  id: string;
  name: string;
  location: string;
  active: boolean;
  createdAt: string;
}

export interface Forecast {
  id: string;
  facilityId: string;
  facilityName: string;
  week: number;
  year: number;
  weekStart: string;
  weekEnd: string;
  forecastedBoxes: number;
  actualBoxes?: number;
  accuracy?: number;
  createdAt: string;
}

export interface WeeklyData {
  week: number;
  year: number;
  weekStart: string;
  weekEnd: string;
  forecasted: number;
  actual?: number;
  facility: string;
}