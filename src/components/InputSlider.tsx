import React from 'react';

type LabelPoint = {
  value: number;
  label: string;
};

type InputSliderProps = {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  labels: LabelPoint[];
};

const InputSlider: React.FC<InputSliderProps> = ({
  name,
  label,
  value,
  onChange,
  min,
  max,
  labels
}) => {
  // Get current linguistic value based on the numeric value
  const getLinguisticValue = (val: number): string => {
    if (val <= (min + (max - min) / 3)) return labels[0].label;
    if (val <= (min + 2 * (max - min) / 3)) return labels[1].label;
    return labels[2].label;
  };

  const currentLinguisticValue = getLinguisticValue(value);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="block text-gray-700 font-medium">
          {label}
        </label>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {currentLinguisticValue} ({value.toFixed(1)})
        </span>
      </div>
      
      <div className="relative pt-1">
        <input
          id={name}
          type="range"
          min={min}
          max={max}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {labels.map((point, index) => (
            <div key={index} className="text-center" style={{ width: `${100 / labels.length}%` }}>
              <div className="relative">
                <div className="absolute h-1.5 w-0.5 bg-gray-400 left-1/2 -top-3 -translate-x-1/2"></div>
              </div>
              <span>{point.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputSlider;