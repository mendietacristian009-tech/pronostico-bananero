import React, { useState, useEffect } from 'react';
import InputSlider from './InputSlider';
import OutputDisplay from './OutputDisplay';
import RulesDisplay from './RulesDisplay';
import ProcessExplanation from './ProcessExplanation';
import { calculateFuzzyOutputs } from '../logic/fuzzyLogic';
import { FuzzyInput, FuzzyOutput } from '../types/fuzzyTypes';
import { Droplets, Clock, Gauge } from 'lucide-react';

const FuzzySimulator = () => {
  const [inputs, setInputs] = useState<FuzzyInput>({
    load: 5,
    dirt: 5,
    fabric: 5
  });

  const [outputs, setOutputs] = useState<FuzzyOutput>({
    time: { value: 5, linguistic: 'Medio' },
    speed: { value: 5, linguistic: 'Media' },
    water: { value: 5, linguistic: 'Medio' }
  });

  // Update outputs whenever inputs change
  useEffect(() => {
    const newOutputs = calculateFuzzyOutputs(inputs);
    setOutputs(newOutputs);
  }, [inputs]);

  const handleInputChange = (name: keyof FuzzyInput, value: number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  // Helper functions to get real-world values
  const getWaterPercentage = (linguistic: string): number => {
    switch (linguistic) {
      case 'Bajo': return 30;
      case 'Medio': return 60;
      case 'Alto': return 90;
      default: return 0;
    }
  };

  const getWashTimeMinutes = (linguistic: string): number => {
    switch (linguistic) {
      case 'Bajo': return 30;
      case 'Medio': return 45;
      case 'Alto': return 60;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-700 text-white p-4">
          <h2 className="text-xl font-semibold">Simulador de Lavadora Inteligente</h2>
          <p className="text-blue-100 text-sm">Ajuste las variables de entrada para ver cómo responde el sistema difuso</p>
        </div>
        
        <div className="p-6" id="simulador">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Variables de Entrada</h3>
          
          <div className="space-y-6">
            <InputSlider 
              name="load"
              label="Carga de Ropa"
              value={inputs.load}
              onChange={(value) => handleInputChange('load', value)}
              min={0}
              max={10}
              labels={[
                { value: 0, label: 'Baja' },
                { value: 5, label: 'Media' },
                { value: 10, label: 'Alta' }
              ]}
            />
            
            <InputSlider 
              name="dirt"
              label="Nivel de Suciedad"
              value={inputs.dirt}
              onChange={(value) => handleInputChange('dirt', value)}
              min={0}
              max={10}
              labels={[
                { value: 0, label: 'Limpio' },
                { value: 5, label: 'Medio' },
                { value: 10, label: 'Sucio' }
              ]}
            />
            
            <InputSlider 
              name="fabric"
              label="Tipo de Tela"
              value={inputs.fabric}
              onChange={(value) => handleInputChange('fabric', value)}
              min={0}
              max={10}
              labels={[
                { value: 0, label: 'Delicada' },
                { value: 5, label: 'Normal' },
                { value: 10, label: 'Gruesa' }
              ]}
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Resultados del Sistema Difuso</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="text-blue-500" size={20} />
                <h4 className="font-medium text-blue-800">Información del Ciclo de Lavado</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-500" size={18} />
                  <span className="text-gray-700">Tiempo de lavado: <span className="font-bold">{getWashTimeMinutes(outputs.time.linguistic)} minutos</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="text-cyan-500" size={18} />
                  <span className="text-gray-700">Agua a utilizar: <span className="font-bold">{getWaterPercentage(outputs.water.linguistic)}%</span></span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OutputDisplay 
                label="Tiempo de Lavado" 
                value={outputs.time.value} 
                linguistic={outputs.time.linguistic}
                color="blue"
              />
              <OutputDisplay 
                label="Velocidad del Motor" 
                value={outputs.speed.value} 
                linguistic={outputs.speed.linguistic}
                color="green"
              />
              <OutputDisplay 
                label="Nivel de Agua" 
                value={outputs.water.value} 
                linguistic={outputs.water.linguistic}
                color="cyan"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-700 text-white p-4">
          <h2 className="text-xl font-semibold">Proceso de Inferencia Difusa</h2>
          <p className="text-blue-100 text-sm">Explicación paso a paso del proceso de decisión</p>
        </div>
        
        <div className="p-6">
          <ProcessExplanation inputs={inputs} outputs={outputs} />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-700 text-white p-4">
          <h2 className="text-xl font-semibold">Reglas Activas</h2>
          <p className="text-blue-100 text-sm">Reglas que se están aplicando con los valores actuales</p>
        </div>
        
        <div className="p-6">
          <RulesDisplay inputs={inputs} outputs={outputs} />
        </div>
      </div>
    </div>
  );
};

export default FuzzySimulator;