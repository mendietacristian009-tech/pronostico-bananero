import React, { useState } from 'react';
import { Info, CircuitBoard, Cpu, Gauge, Zap } from 'lucide-react';

const InfoPanel = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'sensors' | 'fuzzy'>('system');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" id="info">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Info className="mr-2" size={20} />
          Panel Informativo
        </h2>
        <p className="text-gray-300 text-sm">Detalles sobre el sistema embebido simulado</p>
      </div>
      
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('system')}
        >
          <CircuitBoard className="inline mr-1" size={16} />
          Sistema
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'sensors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sensors')}
        >
          <Gauge className="inline mr-1" size={16} />
          Sensores
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'fuzzy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fuzzy')}
        >
          <Zap className="inline mr-1" size={16} />
          Lógica Difusa
        </button>
      </div>
      
      <div className="p-5">
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Sistema Operativo Embebido</h3>
              <p className="text-gray-600">
                En una lavadora real, el sistema de control utilizaría un microcontrolador con un sistema operativo en tiempo real (RTOS) como:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li><strong>FreeRTOS</strong>: Sistema operativo en tiempo real de código abierto diseñado para microcontroladores.</li>
                <li><strong>Arm Mbed OS</strong>: Plataforma para dispositivos IoT basados en microcontroladores ARM Cortex-M.</li>
                <li><strong>Zephyr OS</strong>: Sistema operativo modular que soporta múltiples arquitecturas.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Arquitectura del Sistema</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <Cpu size={48} className="text-blue-600 mb-3" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <div className="text-center bg-blue-50 p-2 rounded">
                      <p className="font-medium">MCU</p>
                      <p className="text-sm text-gray-600">ARM Cortex-M4</p>
                    </div>
                    <div className="text-center bg-blue-50 p-2 rounded">
                      <p className="font-medium">Memoria</p>
                      <p className="text-sm text-gray-600">256KB RAM</p>
                    </div>
                    <div className="text-center bg-blue-50 p-2 rounded">
                      <p className="font-medium">Almacenamiento</p>
                      <p className="text-sm text-gray-600">1MB Flash</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Tareas del Sistema</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="bg-gray-50 p-3 rounded flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">1</div>
                  <div>
                    <strong>Monitoreo de Sensores</strong>
                    <p className="text-sm">Tarea periódica que lee los valores de los sensores de peso, turbidez y tipo de tela.</p>
                  </div>
                </li>
                <li className="bg-gray-50 p-3 rounded flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">2</div>
                  <div>
                    <strong>Controlador Difuso</strong>
                    <p className="text-sm">Procesa las entradas mediante fuzzificación, inferencia y defuzzificación.</p>
                  </div>
                </li>
                <li className="bg-gray-50 p-3 rounded flex items-start">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">3</div>
                  <div>
                    <strong>Control de Actuadores</strong>
                    <p className="text-sm">Controla la velocidad del motor, válvulas de agua y temporizadores.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'sensors' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Sensores Simulados</h3>
              <p className="text-gray-600 mb-4">
                En una lavadora real, varios sensores proporcionarían datos para el controlador difuso:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Sensor de Peso</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Mide la cantidad de ropa cargada en el tambor. Típicamente utiliza galgas extensiométricas o sensores piezoeléctricos montados en la base o suspensión de la lavadora.
                  </p>
                  <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    <strong>Rango:</strong> 0-10 kg
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Sensor de Turbidez</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Detecta la transparencia del agua para determinar el nivel de suciedad. Funciona emitiendo luz y midiendo cuánta es reflejada o dispersada por las partículas en el agua.
                  </p>
                  <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    <strong>Tipo:</strong> Óptico, NTU (Unidades Nefelométricas de Turbidez)
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">Selector de Tipo de Tela</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Entrada del usuario a través del panel de control. En versiones avanzadas podría incluir sensores de textura que detectan automáticamente el tipo de tejido.
                  </p>
                  <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                    <strong>Opciones:</strong> Delicada, Normal, Gruesa
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'fuzzy' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Proceso de Lógica Difusa</h3>
              <p className="text-gray-600">
                El sistema de control difuso implementado sigue estos pasos:
              </p>
              
              <ol className="mt-3 space-y-4">
                <li className="bg-gray-50 p-4 rounded-lg flex">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">1</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Fuzzificación</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Convierte los valores numéricos de entrada en grados de pertenencia a conjuntos difusos mediante funciones de pertenencia triangulares y trapezoidales.
                    </p>
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <strong className="text-sm text-blue-700">Ejemplo:</strong>
                      <p className="text-xs text-gray-600">Una carga de 4kg podría ser 0.33 "Baja" y 0.67 "Media"</p>
                    </div>
                  </div>
                </li>
                
                <li className="bg-gray-50 p-4 rounded-lg flex">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">2</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Inferencia</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Aplica las reglas "Si...Entonces" utilizando operadores difusos (mínimo para AND, máximo para OR) para determinar las conclusiones difusas.
                    </p>
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <strong className="text-sm text-blue-700">Regla de ejemplo:</strong>
                      <p className="text-xs text-gray-600">SI carga es Alta Y suciedad es Sucia Y tela es Gruesa ENTONCES tiempo=Largo, velocidad=Media, agua=Alto</p>
                    </div>
                  </div>
                </li>
                
                <li className="bg-gray-50 p-4 rounded-lg flex">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">3</div>
                  <div>
                    <h4 className="font-medium text-gray-800">Defuzzificación</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Convierte los resultados difusos en valores numéricos precisos mediante el método del centroide o promedio ponderado.
                    </p>
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <strong className="text-sm text-blue-700">Fórmula de centroide:</strong>
                      <p className="text-xs text-gray-600">z = Σ(μ(z) · z) / Σμ(z)</p>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Ventajas de la Lógica Difusa</h3>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Manejo adecuado de la incertidumbre y datos imprecisos</li>
                <li>Implementación de razonamiento similar al humano</li>
                <li>Suavidad en la respuesta y transiciones entre estados</li>
                <li>Reducción del consumo energético y de agua</li>
                <li>Mejora en la calidad del lavado</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;