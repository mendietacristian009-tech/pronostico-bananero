import { FuzzyInput, FuzzyOutput } from "../types/fuzzyTypes";
import { loadMF, dirtMF, fabricMF, timeMF, speedMF, waterMF, getLinguisticTerm } from "./fuzzyMembership";
import { fuzzyRules } from "./fuzzyRules";

// Step 1: Fuzzification - Convert crisp input values to fuzzy values
const fuzzify = (input: FuzzyInput) => {
  return {
    load: {
      low: loadMF.low(input.load),
      medium: loadMF.medium(input.load),
      high: loadMF.high(input.load)
    },
    dirt: {
      low: dirtMF.low(input.dirt),
      medium: dirtMF.medium(input.dirt),
      high: dirtMF.high(input.dirt)
    },
    fabric: {
      low: fabricMF.low(input.fabric),
      medium: fabricMF.medium(input.fabric),
      high: fabricMF.high(input.fabric)
    }
  };
};

// Step 2: Rule Evaluation - Apply fuzzy rules to determine output
const evaluateRules = (fuzzyInput: ReturnType<typeof fuzzify>) => {
  // Initialize aggregated outputs
  const output = {
    time: { low: 0, medium: 0, high: 0 },
    speed: { low: 0, medium: 0, high: 0 },
    water: { low: 0, medium: 0, high: 0 }
  };
  
  // For each rule, calculate the firing strength
  fuzzyRules.forEach(rule => {
    let firingStrength = 1;
    
    // Determine load membership degree
    if (rule.if.load === "Baja" || rule.if.load === "low") {
      firingStrength = Math.min(firingStrength, fuzzyInput.load.low);
    } else if (rule.if.load === "Media" || rule.if.load === "medium") {
      firingStrength = Math.min(firingStrength, fuzzyInput.load.medium);
    } else if (rule.if.load === "Alta" || rule.if.load === "high") {
      firingStrength = Math.min(firingStrength, fuzzyInput.load.high);
    }
    
    // Determine dirt membership degree
    if (rule.if.dirt === "Limpio" || rule.if.dirt === "low") {
      firingStrength = Math.min(firingStrength, fuzzyInput.dirt.low);
    } else if (rule.if.dirt === "Medio" || rule.if.dirt === "medium") {
      firingStrength = Math.min(firingStrength, fuzzyInput.dirt.medium);
    } else if (rule.if.dirt === "Sucio" || rule.if.dirt === "high") {
      firingStrength = Math.min(firingStrength, fuzzyInput.dirt.high);
    }
    
    // Determine fabric membership degree
    if (rule.if.fabric === "Delicada" || rule.if.fabric === "low") {
      firingStrength = Math.min(firingStrength, fuzzyInput.fabric.low);
    } else if (rule.if.fabric === "Normal" || rule.if.fabric === "medium") {
      firingStrength = Math.min(firingStrength, fuzzyInput.fabric.medium);
    } else if (rule.if.fabric === "Gruesa" || rule.if.fabric === "high") {
      firingStrength = Math.min(firingStrength, fuzzyInput.fabric.high);
    }
    
    // Apply rule consequence if rule fires
    if (firingStrength > 0) {
      // Time output
      if (rule.then.time === "Bajo" || rule.then.time === "low") {
        output.time.low = Math.max(output.time.low, firingStrength);
      } else if (rule.then.time === "Medio" || rule.then.time === "medium") {
        output.time.medium = Math.max(output.time.medium, firingStrength);
      } else if (rule.then.time === "Alto" || rule.then.time === "high") {
        output.time.high = Math.max(output.time.high, firingStrength);
      }
      
      // Speed output
      if (rule.then.speed === "Baja" || rule.then.speed === "low") {
        output.speed.low = Math.max(output.speed.low, firingStrength);
      } else if (rule.then.speed === "Media" || rule.then.speed === "medium") {
        output.speed.medium = Math.max(output.speed.medium, firingStrength);
      } else if (rule.then.speed === "Alta" || rule.then.speed === "high") {
        output.speed.high = Math.max(output.speed.high, firingStrength);
      }
      
      // Water output
      if (rule.then.water === "Bajo" || rule.then.water === "low") {
        output.water.low = Math.max(output.water.low, firingStrength);
      } else if (rule.then.water === "Medio" || rule.then.water === "medium") {
        output.water.medium = Math.max(output.water.medium, firingStrength);
      } else if (rule.then.water === "Alto" || rule.then.water === "high") {
        output.water.high = Math.max(output.water.high, firingStrength);
      }
    }
  });
  
  return output;
};

// Step 3: Defuzzification - Convert fuzzy output to crisp values
const defuzzify = (aggregatedOutput: ReturnType<typeof evaluateRules>): FuzzyOutput => {
  // Calculate output using centroid method (weighted average)
  
  // Time calculation
  const timeSum = 
    aggregatedOutput.time.low * 2 + 
    aggregatedOutput.time.medium * 5 + 
    aggregatedOutput.time.high * 8;
  const timeWeightSum = 
    aggregatedOutput.time.low + 
    aggregatedOutput.time.medium + 
    aggregatedOutput.time.high;
  
  // Speed calculation
  const speedSum = 
    aggregatedOutput.speed.low * 2 + 
    aggregatedOutput.speed.medium * 5 + 
    aggregatedOutput.speed.high * 8;
  const speedWeightSum = 
    aggregatedOutput.speed.low + 
    aggregatedOutput.speed.medium + 
    aggregatedOutput.speed.high;
  
  // Water calculation
  const waterSum = 
    aggregatedOutput.water.low * 2 + 
    aggregatedOutput.water.medium * 5 + 
    aggregatedOutput.water.high * 8;
  const waterWeightSum = 
    aggregatedOutput.water.low + 
    aggregatedOutput.water.medium + 
    aggregatedOutput.water.high;
  
  // Calculate defuzzified values (prevent division by zero)
  const timeValue = timeWeightSum > 0 ? timeSum / timeWeightSum : 5;
  const speedValue = speedWeightSum > 0 ? speedSum / speedWeightSum : 5;
  const waterValue = waterWeightSum > 0 ? waterSum / waterWeightSum : 5;
  
  // Get linguistic terms for outputs
  const timeLinguistic = getLinguisticTerm(timeValue);
  const speedLinguistic = getLinguisticTerm(speedValue);
  const waterLinguistic = getLinguisticTerm(waterValue);
  
  // Special case for Speed: use feminine form in Spanish
  const speedSpanishTerm = speedLinguistic === "Bajo" ? "Baja" : 
                           speedLinguistic === "Medio" ? "Media" : 
                           speedLinguistic === "Alto" ? "Alta" : speedLinguistic;
  
  return {
    time: {
      value: timeValue,
      linguistic: timeLinguistic
    },
    speed: {
      value: speedValue,
      linguistic: speedSpanishTerm
    },
    water: {
      value: waterValue,
      linguistic: waterLinguistic
    }
  };
};

// Main function to calculate fuzzy outputs from inputs
export const calculateFuzzyOutputs = (input: FuzzyInput): FuzzyOutput => {
  // Step 1: Fuzzification
  const fuzzyInput = fuzzify(input);
  
  // Step 2: Rule Evaluation
  const aggregatedOutput = evaluateRules(fuzzyInput);
  
  // Step 3: Defuzzification
  return defuzzify(aggregatedOutput);
};