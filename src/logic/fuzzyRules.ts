import { FuzzyRule } from "../types/fuzzyTypes";

// Define all rules for fuzzy inference
export const fuzzyRules: FuzzyRule[] = [
  // Rule 1
  {
    if: {
      load: "Alta",
      dirt: "Sucio",
      fabric: "Gruesa"
    },
    then: {
      time: "Alto",
      speed: "Media",
      water: "Alto"
    }
  },
  // Rule 2
  {
    if: {
      load: "Baja",
      dirt: "Limpio",
      fabric: "Delicada"
    },
    then: {
      time: "Bajo",
      speed: "Baja",
      water: "Bajo"
    }
  },
  // Rule 3
  {
    if: {
      load: "Media",
      dirt: "Medio",
      fabric: "Normal"
    },
    then: {
      time: "Medio",
      speed: "Media",
      water: "Medio"
    }
  },
  // Rule 4
  {
    if: {
      load: "Alta",
      dirt: "Limpio",
      fabric: "*"
    },
    then: {
      time: "Medio",
      speed: "Media",
      water: "Alto"
    }
  },
  // Rule 5
  {
    if: {
      load: "Baja",
      dirt: "Sucio",
      fabric: "*"
    },
    then: {
      time: "Alto",
      speed: "Media",
      water: "Bajo"
    }
  },
  // Rule 6
  {
    if: {
      load: "*",
      dirt: "*",
      fabric: "Delicada"
    },
    then: {
      time: "Medio",
      speed: "Baja",
      water: "Medio"
    }
  },
  // Rule 7
  {
    if: {
      load: "*",
      dirt: "Sucio",
      fabric: "Gruesa"
    },
    then: {
      time: "Alto",
      speed: "Alta",
      water: "Alto"
    }
  },
  // Rule 8
  {
    if: {
      load: "Media",
      dirt: "Limpio",
      fabric: "*"
    },
    then: {
      time: "Bajo",
      speed: "Media",
      water: "Medio"
    }
  },
  // Rule 9
  {
    if: {
      load: "Baja",
      dirt: "Medio",
      fabric: "Normal"
    },
    then: {
      time: "Medio",
      speed: "Media",
      water: "Bajo"
    }
  },
  // Rule 10
  {
    if: {
      load: "Alta",
      dirt: "Medio",
      fabric: "Delicada"
    },
    then: {
      time: "Medio",
      speed: "Baja",
      water: "Alto"
    }
  },
  // Rule 11
  {
    if: {
      load: "Media",
      dirt: "Sucio",
      fabric: "Delicada"
    },
    then: {
      time: "Alto",
      speed: "Baja",
      water: "Medio"
    }
  },
  // Rule 12
  {
    if: {
      load: "Media",
      dirt: "Medio",
      fabric: "Gruesa"
    },
    then: {
      time: "Alto",
      speed: "Media",
      water: "Medio"
    }
  }
];