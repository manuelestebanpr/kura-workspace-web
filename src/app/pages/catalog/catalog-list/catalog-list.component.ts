import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, Service } from '../../../services/api.service';

type ServiceType = 'ALL' | 'SINGLE' | 'BUNDLE';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule],
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {
  services: Service[] = [];
  filteredServices: Service[] = [];
  searchQuery = '';
  selectedType: ServiceType = 'ALL';
  loading = false;
  error: string | null = null;

  // Hardcoded sample data for MVP
  private sampleServices: Service[] = [
    { code: 'LAB-001', name: 'Hemograma Completo', description: 'Análisis completo de sangre', category: 'Hematología', basePrice: 45000, serviceType: 'SINGLE' },
    { code: 'LAB-002', name: 'Perfil Lipídico', description: 'Colesterol, triglicéridos, HDL, LDL', category: 'Química Clínica', basePrice: 78000, serviceType: 'SINGLE' },
    { code: 'LAB-003', name: 'Perfil Tiroideo', description: 'TSH, T3, T4', category: 'Endocrinología', basePrice: 125000, serviceType: 'BUNDLE', childServiceIds: ['LAB-031', 'LAB-032', 'LAB-033'] },
    { code: 'LAB-004', name: 'Glucosa en Ayunas', description: 'Nivel de glucosa', category: 'Química Clínica', basePrice: 25000, serviceType: 'SINGLE' },
    { code: 'LAB-005', name: 'Uroanálisis', description: 'Análisis completo de orina', category: 'Uroanálisis', basePrice: 35000, serviceType: 'SINGLE' },
    { code: 'LAB-006', name: 'Examen General de Orina', description: 'Físico, químico y microscópico', category: 'Uroanálisis', basePrice: 32000, serviceType: 'SINGLE' },
    { code: 'LAB-007', name: 'Panel Básico de Metabolismo', description: 'Glucosa, BUN, creatinina, electrolitos', category: 'Química Clínica', basePrice: 95000, serviceType: 'BUNDLE' },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;

    // MOCK INTEGRATION: API - Using sample data for MVP
    // In production: this.apiService.searchServices('', 100).subscribe(...)
    setTimeout(() => {
      this.services = [...this.sampleServices];
      this.filterServices();
      this.loading = false;
    }, 500);
  }

  filterServices(): void {
    let filtered = [...this.services];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (this.selectedType !== 'ALL') {
      filtered = filtered.filter(s => s.serviceType === this.selectedType);
    }

    this.filteredServices = filtered;
  }

  onSearch(): void {
    this.filterServices();
  }

  onTypeChange(type: ServiceType): void {
    this.selectedType = type;
    this.filterServices();
  }

  getTypeBadgeClass(type: string): string {
    return type === 'SINGLE' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  }

  getTypeLabel(type: string): string {
    return type === 'SINGLE' ? 'Individual' : 'Paquete';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }
}
