import { PackingFacility, Forecast } from '../types';

export function generateMockData() {
  const facilities: PackingFacility[] = [];
  const forecasts: Forecast[] = [];

  return { facilities, forecasts };
}
