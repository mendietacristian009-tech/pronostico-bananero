// Input types
export interface FuzzyInput {
  load: number;
  dirt: number;
  fabric: number;
}

// Output with both numeric value and linguistic term
export interface OutputValue {
  value: number;
  linguistic: string;
}

export interface FuzzyOutput {
  time: OutputValue;
  speed: OutputValue;
  water: OutputValue;
}

// Rule types
export interface FuzzyRule {
  if: {
    load: string;
    dirt: string;
    fabric: string;
  };
  then: {
    time: string;
    speed: string;
    water: string;
  };
}

// Membership function type
export interface MembershipFunction {
  low: (value: number) => number;
  medium: (value: number) => number;
  high: (value: number) => number;
}