import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Service {
  id?: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  serviceType: 'SINGLE' | 'BUNDLE';
  isCustom?: boolean;
  childServiceIds?: string[];
}

export interface Offering {
  id?: string;
  serviceId: string;
  posId: string;
  price: number;
  enabled: boolean;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  patientId?: string;
  posId: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  walkInTicketCode?: string;
  walkInTicketExpiry?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt?: string;
}

export interface OrderItem {
  id?: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Result {
  id?: string;
  orderId: string;
  patientId: string;
  serviceId: string;
  serviceName: string;
  status: 'PENDING' | 'SAMPLE_TAKEN' | 'IN_PROGRESS' | 'COMPLETED';
  sampleTakenAt?: string;
  completedAt?: string;
  resultData?: string;
  audioUrl?: string;
  shareUuid?: string;
}

export interface ImportResult {
  imported: number;
  updated: number;
  errors: number;
  details?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== CATALOG ====================

  createService(data: Service): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/catalog/services`, data);
  }

  getService(code: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/catalog/services/${code}`);
  }

  searchServices(q: string, limit: number = 20): Observable<Service[]> {
    const params = new HttpParams()
      .set('q', q)
      .set('limit', limit.toString());
    return this.http.get<Service[]>(`${this.baseUrl}/catalog/services/search`, { params });
  }

  getServicesByType(type: 'SINGLE' | 'BUNDLE'): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/catalog/services/type/${type}`);
  }

  createOffering(data: Offering): Observable<Offering> {
    return this.http.post<Offering>(`${this.baseUrl}/catalog/offerings`, data);
  }

  // ==================== COMMERCE ====================

  getOrder(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/commerce/orders/${orderNumber}`);
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/commerce/orders/user/${userId}`);
  }

  // ==================== RESULTS ====================

  markSampleTaken(resultId: string): Observable<Result> {
    return this.http.post<Result>(`${this.baseUrl}/results/${resultId}/sample-taken`, {});
  }

  completeResult(resultId: string, data: { resultData: string }): Observable<Result> {
    return this.http.post<Result>(`${this.baseUrl}/results/${resultId}/complete`, data);
  }

  uploadAudio(resultId: string, file: File): Observable<Result> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Result>(`${this.baseUrl}/results/${resultId}/audio`, formData);
  }

  createShareLink(resultId: string): Observable<{ shareUuid: string }> {
    return this.http.post<{ shareUuid: string }>(`${this.baseUrl}/results/${resultId}/share`, {});
  }

  getResultsByOrder(orderId: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/results/order/${orderId}`);
  }

  getResultsByPatient(patientId: string): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/results/patient/${patientId}`);
  }

  // ==================== IMPORT ====================

  importPatients(file: File, columnMapping: Record<string, string>): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('columnMapping', JSON.stringify(columnMapping));
    return this.http.post<ImportResult>(`${this.baseUrl}/import/patients`, formData);
  }

  // ==================== HEALTH ====================

  ping(): Observable<{ status: string; timestamp?: string }> {
    return this.http.get<{ status: string; timestamp?: string }>(`${this.baseUrl}/ping`);
  }
}
