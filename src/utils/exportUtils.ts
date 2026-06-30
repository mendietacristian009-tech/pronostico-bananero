import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Forecast } from '../types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function exportToPDF(forecasts: Forecast[], title: string = 'Reporte de Pronósticos') {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 35);
  
  // Prepare table data
  const tableData = forecasts.map(f => [
    f.facilityName,
    `Semana ${f.week}/${f.year}`,
    f.weekStart,
    f.weekEnd,
    f.forecastedBoxes.toLocaleString(),
    f.actualBoxes ? f.actualBoxes.toLocaleString() : 'N/A',
    f.accuracy ? `${f.accuracy.toFixed(1)}%` : 'N/A'
  ]);
  
  // Add table
  doc.autoTable({
    head: [['Empacadora', 'Semana', 'Inicio', 'Fin', 'Pronóstico', 'Real', 'Precisión']],
    body: tableData,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94] }
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export function exportToExcel(forecasts: Forecast[], filename: string = 'pronosticos') {
  const worksheet = XLSX.utils.json_to_sheet(
    forecasts.map(f => ({
      'Empacadora': f.facilityName,
      'Semana': `${f.week}/${f.year}`,
      'Fecha Inicio': f.weekStart,
      'Fecha Fin': f.weekEnd,
      'Pronóstico (Cajas)': f.forecastedBoxes,
      'Real (Cajas)': f.actualBoxes || 'N/A',
      'Precisión (%)': f.accuracy ? f.accuracy.toFixed(1) : 'N/A',
      'Fecha Creación': new Date(f.createdAt).toLocaleDateString('es-ES')
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pronósticos');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}