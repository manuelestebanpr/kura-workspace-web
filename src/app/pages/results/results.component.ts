import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Result } from '../../services/api.service';

interface ResultWithUI extends Result {
  showCompleteModal?: boolean;
  showShareModal?: boolean;
  resultDataInput?: string;
  shareLink?: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: ResultWithUI[] = [];
  filteredResults: ResultWithUI[] = [];
  searchQuery = '';
  searchType: 'order' | 'patient' = 'order';
  loading = false;
  error: string | null = null;
  copiedLink: string | null = null;

  // Hardcoded sample data for MVP
  private sampleResults: ResultWithUI[] = [
    {
      id: 'res-001',
      orderId: 'ord-001',
      patientId: 'pat-001',
      serviceId: 'LAB-001',
      serviceName: 'Hemograma Completo',
      status: 'PENDING',
    },
    {
      id: 'res-002',
      orderId: 'ord-001',
      patientId: 'pat-001',
      serviceId: 'LAB-002',
      serviceName: 'Perfil Lipídico',
      status: 'SAMPLE_TAKEN',
      sampleTakenAt: '2025-02-17T09:30:00',
    },
    {
      id: 'res-003',
      orderId: 'ord-002',
      patientId: 'pat-002',
      serviceId: 'LAB-004',
      serviceName: 'Glucosa en Ayunas',
      status: 'COMPLETED',
      sampleTakenAt: '2025-02-17T10:00:00',
      completedAt: '2025-02-17T11:30:00',
      resultData: 'Glucosa: 95 mg/dL (Normal)',
      shareUuid: 'share-uuid-123',
    },
    {
      id: 'res-004',
      orderId: 'ord-003',
      patientId: 'pat-003',
      serviceId: 'LAB-003',
      serviceName: 'Perfil Tiroideo',
      status: 'COMPLETED',
      sampleTakenAt: '2025-02-16T15:00:00',
      completedAt: '2025-02-16T17:30:00',
      resultData: 'TSH: 2.5 mIU/L\nT3 Libre: 3.2 pg/mL\nT4 Libre: 1.2 ng/dL',
      shareUuid: 'share-uuid-456',
    },
    {
      id: 'res-005',
      orderId: 'ord-004',
      patientId: 'pat-004',
      serviceId: 'LAB-002',
      serviceName: 'Perfil Lipídico',
      status: 'IN_PROGRESS',
      sampleTakenAt: '2025-02-16T11:00:00',
    },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.loading = true;
    this.error = null;

    // MOCK INTEGRATION: API - Using sample data for MVP
    // In production: this.apiService.getResultsByOrder(...) or getResultsByPatient(...)
    setTimeout(() => {
      this.results = [...this.sampleResults];
      this.filteredResults = [...this.results];
      this.loading = false;
    }, 500);
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredResults = [...this.results];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    if (this.searchType === 'order') {
      this.filteredResults = this.results.filter(r => r.orderId.toLowerCase().includes(query));
    } else {
      this.filteredResults = this.results.filter(r => r.patientId.toLowerCase().includes(query));
    }
  }

  markSampleTaken(result: ResultWithUI): void {
    // MOCK INTEGRATION: API - Simulating API call for MVP
    // In production: this.apiService.markSampleTaken(result.id!).subscribe(...)
    result.status = 'SAMPLE_TAKEN';
    result.sampleTakenAt = new Date().toISOString();
  }

  openCompleteModal(result: ResultWithUI): void {
    result.showCompleteModal = true;
    result.resultDataInput = result.resultData || '';
  }

  closeCompleteModal(result: ResultWithUI): void {
    result.showCompleteModal = false;
  }

  completeResult(result: ResultWithUI): void {
    if (!result.resultDataInput?.trim()) return;

    // MOCK INTEGRATION: API - Simulating API call for MVP
    // In production: this.apiService.completeResult(result.id!, { resultData: result.resultDataInput }).subscribe(...)
    result.status = 'COMPLETED';
    result.completedAt = new Date().toISOString();
    result.resultData = result.resultDataInput;
    result.showCompleteModal = false;
  }

  uploadAudio(result: ResultWithUI, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // MOCK INTEGRATION: API - Simulating file upload for MVP
    // In production: this.apiService.uploadAudio(result.id!, file).subscribe(...)
    console.log('Uploading audio file:', file.name);
    result.audioUrl = URL.createObjectURL(file);
  }

  createShareLink(result: ResultWithUI): void {
    // MOCK INTEGRATION: API - Simulating API call for MVP
    // In production: this.apiService.createShareLink(result.id!).subscribe(...)
    result.shareUuid = `share-${Math.random().toString(36).substring(7)}`;
    result.shareLink = `${window.location.origin}/shared/${result.shareUuid}`;
    result.showShareModal = true;
  }

  closeShareModal(result: ResultWithUI): void {
    result.showShareModal = false;
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link).then(() => {
      this.copiedLink = link;
      setTimeout(() => this.copiedLink = null, 2000);
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-gray-100 text-gray-800',
      'SAMPLE_TAKEN': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'SAMPLE_TAKEN': 'Muestra Tomada',
      'IN_PROGRESS': 'En Proceso',
      'COMPLETED': 'Completado',
    };
    return labels[status] || status;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
