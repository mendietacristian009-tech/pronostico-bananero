export interface Facility {
  id: string;
  name: string;
  location: string;
  active: boolean;
  createdAt: string;
}

export interface BoxRecord {
  id: string;
  facilityId: string;
  date: string;
  boxCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Forecast {
  id: string;
  facilityId: string;
  weekStartDate: string;
  weekEndDate: string;
  predictedBoxes: number;
  actualBoxes?: number;
  accuracy?: number;
  createdAt: string;
}

export interface ForecastWithFacility extends Forecast {
  facility: {
    name: string;
  };
}

export interface WeeklyProductionData {
  weekStarting: string;
  predictedBoxes: number;
  actualBoxes: number;
}

export interface FacilityProductionData {
  facilityName: string;
  data: WeeklyProductionData[];
}