import React from 'react';
import { FuzzyInput, FuzzyOutput } from '../types/fuzzyTypes';
import { loadMF, dirtMF, fabricMF } from '../logic/fuzzyMembership';

interface ProcessExplanationProps {
  inputs: FuzzyInput;
  outputs: FuzzyOutput;
}

const ProcessExplanation: React.FC<ProcessExplanationProps> = ({ inputs, outputs }) => {
  // Calculate membership degrees for each input
  const loadDegrees = {
    low: loadMF.low(inputs.load),
    medium: loadMF.medium(inputs.load),
    high: loadMF.high(inputs.load)
  };

  const dirtDegrees = {
    low: dirtMF.low(inputs.dirt),
    medium: dirtMF.medium(inputs.dirt),
    high: dirtMF.high(inputs.dirt)
  };

  const fabricDegrees = {
    low: fabricMF.low(inputs.fabric),
    medium: fabricMF.medium(inputs.fabric),
    high: fabricMF.high(inputs.fabric)
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">1. Fuzzificación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Carga de Ropa</h4>
            <div className="space-y-1 text-sm">
              <p>Valor crisp: {inputs.load.toFixed(1)}</p>
              <p>Grado de pertenencia:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Baja: {loadDegrees.low.toFixed(2)}</li>
                <li>Media: {loadDegrees.medium.toFixed(2)}</li>
                <li>Alta: {loadDegrees.high.toFixed(2)}</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Nivel de Suciedad</h4>
            <div className="space-y-1 text-sm">
              <p>Valor crisp: {inputs.dirt.toFixed(1)}</p>
              <p>Grado de pertenencia:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Limpio: {dirtDegrees.low.toFixed(2)}</li>
                <li>Medio: {dirtDegrees.medium.toFixed(2)}</li>
                <li>Sucio: {dirtDegrees.high.toFixed(2)}</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Tipo de Tela</h4>
            <div className="space-y-1 text-sm">
              <p>Valor crisp: {inputs.fabric.toFixed(1)}</p>
              <p>Grado de pertenencia:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Delicada: {fabricDegrees.low.toFixed(2)}</li>
                <li>Normal: {fabricDegrees.medium.toFixed(2)}</li>
                <li>Gruesa: {fabricDegrees.high.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">2. Resultados de Defuzzificación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Tiempo de Lavado</h4>
            <div className="space-y-1 text-sm">
              <p>Valor numérico: {outputs.time.value.toFixed(1)}</p>
              <p>Término lingüístico: {outputs.time.linguistic}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Velocidad del Motor</h4>
            <div className="space-y-1 text-sm">
              <p>Valor numérico: {outputs.speed.value.toFixed(1)}</p>
              <p>Término lingüístico: {outputs.speed.linguistic}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Nivel de Agua</h4>
            <div className="space-y-1 text-sm">
              <p>Valor numérico: {outputs.water.value.toFixed(1)}</p>
              <p>Término lingüístico: {outputs.water.linguistic}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Explicación del Proceso</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. Los valores de entrada se convierten a grados de pertenencia usando funciones triangulares.</p>
          <p>2. Se evalúan todas las reglas difusas, calculando su grado de activación.</p>
          <p>3. Se combinan los resultados usando el método del centroide para obtener valores precisos.</p>
          <p>4. Los valores numéricos se convierten a términos lingüísticos para su interpretación.</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessExplanation;