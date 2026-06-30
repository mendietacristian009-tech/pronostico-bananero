import React, { useEffect, useRef } from 'react';

type OutputDisplayProps = {
  label: string;
  value: number;
  linguistic: string;
  color: string;
};

const OutputDisplay: React.FC<OutputDisplayProps> = ({ label, value, linguistic, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Function to convert linguistic water level to percentage
  const getWaterPercentage = (label: string, linguistic: string): string => {
    if (label.includes("Agua")) {
      switch (linguistic) {
        case 'Bajo': return '30%';
        case 'Medio': return '60%';
        case 'Alto': return '90%';
        default: return '0%';
      }
    }
    return linguistic;
  };

  // Function to convert linguistic time to minutes
  const getWashTimeMinutes = (label: string, linguistic: string): string => {
    if (label.includes("Tiempo")) {
      switch (linguistic) {
        case 'Bajo': return '30 min';
        case 'Medio': return '45 min';
        case 'Alto': return '60 min';
        default: return '0 min';
      }
    }
    return linguistic;
  };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Setting up dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();
    
    // Calculate angle based on value (0-10)
    const normalizedValue = value / 10;
    const startAngle = Math.PI * 0.75; // Start at 135 degrees
    const endAngle = startAngle + normalizedValue * Math.PI * 1.5; // Max 315 degrees
    
    // Draw colored arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    
    // Set color based on prop
    let fillColor = '#3B82F6'; // Default blue
    if (color === 'green') fillColor = '#10B981';
    if (color === 'cyan') fillColor = '#06B6D4';
    
    ctx.fillStyle = fillColor;
    ctx.fill();
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Draw value text
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#1F2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${(value).toFixed(1)}`, centerX, centerY - 15);
    
    // Get display value based on type
    let displayValue = linguistic;
    if (label.includes("Agua")) {
      const percentage = parseInt(getWaterPercentage(label, linguistic));
      displayValue = `${percentage}%`;
    } else if (label.includes("Tiempo")) {
      const minutes = parseInt(getWashTimeMinutes(label, linguistic));
      displayValue = `${minutes} min`;
    }
    
    // Draw display value
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText(displayValue, centerX, centerY + 15);
    
  }, [value, linguistic, color, label]);

  // Determine additional display text
  const getDisplayText = () => {
    if (label.includes("Agua")) {
      return `Agua a utilizar: ${getWaterPercentage(label, linguistic)}`;
    } else if (label.includes("Tiempo")) {
      return `Duración del lavado: ${getWashTimeMinutes(label, linguistic)}`;
    }
    return `${label}: ${linguistic}`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center flex flex-col items-center">
      <h4 className="text-lg font-medium text-gray-700 mb-3">{label}</h4>
      <canvas 
        ref={canvasRef}
        width={160}
        height={160}
        className="mb-2"
      />
      <div className="mt-2 text-sm font-medium text-gray-600">
        {getDisplayText()}
      </div>
    </div>
  );
};

export default OutputDisplay;