import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Papa from 'papaparse';
import { ApiService, ImportResult } from '../../services/api.service';

interface CsvRow {
  [key: string]: string;
}

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  csvData: CsvRow[] = [];
  csvHeaders: string[] = [];
  columnMapping: Record<string, string> = {};
  file: File | null = null;
  
  dragOver = false;
  loading = false;
  importResult: ImportResult | null = null;
  error: string | null = null;
  previewVisible = false;

  // Available field mappings
  availableFields = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'fullName', label: 'Nombre Completo' },
    { value: 'email', label: 'Correo Electrónico' },
    { value: 'phone', label: 'Teléfono' },
    { value: 'skip', label: 'Omitir columna' },
  ];

  constructor(private apiService: ApiService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      this.error = 'Por favor seleccione un archivo CSV válido';
      return;
    }

    this.file = file;
    this.error = null;
    this.importResult = null;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.csvData = results.data as CsvRow[];
        this.csvHeaders = results.meta.fields || [];
        
        // Initialize column mapping
        this.columnMapping = {};
        this.csvHeaders.forEach(header => {
          // Try to auto-detect mapping based on header name
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('cedula') || lowerHeader.includes('id') || lowerHeader.includes('documento')) {
            this.columnMapping[header] = 'cedula';
          } else if (lowerHeader.includes('nombre') || lowerHeader.includes('name')) {
            this.columnMapping[header] = 'fullName';
          } else if (lowerHeader.includes('email') || lowerHeader.includes('correo')) {
            this.columnMapping[header] = 'email';
          } else if (lowerHeader.includes('telefono') || lowerHeader.includes('phone') || lowerHeader.includes('celular')) {
            this.columnMapping[header] = 'phone';
          } else {
            this.columnMapping[header] = 'skip';
          }
        });

        this.previewVisible = true;
      },
      error: (error) => {
        this.error = `Error al parsear CSV: ${error.message}`;
      }
    });
  }

  clearFile(): void {
    this.file = null;
    this.csvData = [];
    this.csvHeaders = [];
    this.columnMapping = {};
    this.previewVisible = false;
    this.importResult = null;
    this.error = null;
  }

  importPatients(): void {
    if (!this.file) return;

    this.loading = true;
    this.error = null;
    this.importResult = null;

    // MOCK INTEGRATION: API - Simulating API call for MVP
    // In production: this.apiService.importPatients(this.file, this.columnMapping).subscribe(...)
    setTimeout(() => {
      this.loading = false;
      this.importResult = {
        imported: Math.floor(this.csvData.length * 0.8),
        updated: Math.floor(this.csvData.length * 0.15),
        errors: Math.floor(this.csvData.length * 0.05),
        details: ['Fila 3: Cédula duplicada', 'Fila 7: Email inválido']
      };
    }, 1500);
  }

  getPreviewRows(): CsvRow[] {
    return this.csvData.slice(0, 5);
  }

  getFieldLabel(fieldValue: string): string {
    const field = this.availableFields.find(f => f.value === fieldValue);
    return field ? field.label : '';
  }
}
