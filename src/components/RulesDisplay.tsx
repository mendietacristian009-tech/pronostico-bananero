import React from 'react';
import { FuzzyInput, FuzzyOutput } from '../types/fuzzyTypes';
import { fuzzyRules } from '../logic/fuzzyRules';

type RulesDisplayProps = {
  inputs: FuzzyInput;
  outputs: FuzzyOutput;
};

const RulesDisplay: React.FC<RulesDisplayProps> = ({ inputs, outputs }) => {
  // Determine which linguistic term applies based on value
  const getLinguisticInput = (value: number, type: 'load' | 'dirt' | 'fabric'): string => {
    if (value <= 3) {
      return type === 'load' ? 'Baja' : type === 'dirt' ? 'Limpio' : 'Delicada';
    } else if (value <= 6) {
      return 'Media' + (type === 'dirt' ? '' : type === 'fabric' ? '' : '');
    } else {
      return type === 'load' ? 'Alta' : type === 'dirt' ? 'Sucio' : 'Gruesa';
    }
  };

  // Helper function to determine if a rule is active based on current inputs
  const isRuleActive = (index: number): boolean => {
    const rule = fuzzyRules[index];
    const currentLoadTerm = getLinguisticInput(inputs.load, 'load');
    const currentDirtTerm = getLinguisticInput(inputs.dirt, 'dirt');
    const currentFabricTerm = getLinguisticInput(inputs.fabric, 'fabric');
    
    // Check if the rule matches current input states
    return (
      (rule.if.load === currentLoadTerm || rule.if.load === '*') &&
      (rule.if.dirt === currentDirtTerm || rule.if.dirt === '*') &&
      (rule.if.fabric === currentFabricTerm || rule.if.fabric === '*')
    );
  };

  // Function to convert linguistic water level to percentage
  const getWaterPercentage = (waterLevel: string): number => {
    switch (waterLevel) {
      case 'Bajo': return 30;
      case 'Medio': return 60;
      case 'Alto': return 90;
      default: return 0;
    }
  };

  // Function to convert linguistic time to minutes
  const getWashTimeMinutes = (timeLevel: string): number => {
    switch (timeLevel) {
      case 'Bajo': return 30;
      case 'Medio': return 45;
      case 'Alto': return 60;
      default: return 0;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Reglas Difusas</h3>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 overflow-auto max-h-96">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">#</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Si</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Entonces</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fuzzyRules.map((rule, index) => {
              const active = isRuleActive(index);
              const waterPercentage = getWaterPercentage(rule.then.water);
              const washTime = getWashTimeMinutes(rule.then.time);
              
              return (
                <tr key={index} className={active ? 'bg-blue-50' : ''}>
                  <td className="py-3 px-3 text-sm">{index + 1}</td>
                  <td className="py-3 px-3 text-sm">
                    <p>
                      <span className="font-medium">Carga</span>: {rule.if.load === '*' ? 'Cualquiera' : rule.if.load}
                    </p>
                    <p>
                      <span className="font-medium">Suciedad</span>: {rule.if.dirt === '*' ? 'Cualquiera' : rule.if.dirt}
                    </p>
                    <p>
                      <span className="font-medium">Tela</span>: {rule.if.fabric === '*' ? 'Cualquiera' : rule.if.fabric}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    <p>
                      <span className="font-medium">Tiempo</span>: {rule.then.time}
                    </p>
                    <p>
                      <span className="font-medium">Velocidad</span>: {rule.then.speed}
                    </p>
                    <p>
                      <span className="font-medium">Agua</span>: {rule.then.water}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-sm">
                    {active ? (
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 w-full justify-center">
                          Agua: {waterPercentage}%
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-full justify-center">
                          Tiempo: {washTime} minutos
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactiva
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RulesDisplay;