import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, Order, OrderItem } from '../../services/api.service';

interface ExpandedOrder extends Order {
  expanded?: boolean;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: ExpandedOrder[] = [];
  filteredOrders: ExpandedOrder[] = [];
  searchQuery = '';
  loading = false;
  error: string | null = null;

  // Hardcoded sample data for MVP
  private sampleOrders: ExpandedOrder[] = [
    {
      id: 'ord-001',
      orderNumber: 'ORD-2025-00142',
      userId: 'usr-001',
      patientId: 'pat-001',
      posId: 'Sede Principal',
      status: 'PENDING',
      total: 125000,
      items: [
        { serviceId: 'LAB-001', serviceName: 'Hemograma Completo', quantity: 1, unitPrice: 45000, total: 45000 },
        { serviceId: 'LAB-002', serviceName: 'Perfil Lipídico', quantity: 1, unitPrice: 80000, total: 80000 },
      ],
      walkInTicketCode: 'WALK-ABC123',
      walkInTicketExpiry: '2025-02-18T10:00:00',
      paymentStatus: 'PENDING',
      createdAt: '2025-02-17T08:30:00',
    },
    {
      id: 'ord-002',
      orderNumber: 'ORD-2025-00141',
      userId: 'usr-002',
      patientId: 'pat-002',
      posId: 'Sede Principal',
      status: 'CONFIRMED',
      total: 89000,
      items: [
        { serviceId: 'LAB-004', serviceName: 'Glucosa en Ayunas', quantity: 1, unitPrice: 25000, total: 25000 },
        { serviceId: 'LAB-005', serviceName: 'Uroanálisis', quantity: 1, unitPrice: 35000, total: 35000 },
        { serviceId: 'LAB-006', serviceName: 'Examen General de Orina', quantity: 1, unitPrice: 29000, total: 29000 },
      ],
      walkInTicketCode: 'WALK-DEF456',
      walkInTicketExpiry: '2025-02-18T14:00:00',
      paymentStatus: 'PAID',
      createdAt: '2025-02-17T09:15:00',
    },
    {
      id: 'ord-003',
      orderNumber: 'ORD-2025-00140',
      userId: 'usr-003',
      patientId: 'pat-003',
      posId: 'Sucursal Norte',
      status: 'COMPLETED',
      total: 245000,
      items: [
        { serviceId: 'LAB-003', serviceName: 'Perfil Tiroideo', quantity: 1, unitPrice: 125000, total: 125000 },
        { serviceId: 'LAB-007', serviceName: 'Panel Básico de Metabolismo', quantity: 1, unitPrice: 95000, total: 95000 },
        { serviceId: 'LAB-001', serviceName: 'Hemograma Completo', quantity: 1, unitPrice: 25000, total: 25000 },
      ],
      walkInTicketCode: 'WALK-GHI789',
      walkInTicketExpiry: '2025-02-17T18:00:00',
      paymentStatus: 'PAID',
      createdAt: '2025-02-16T14:20:00',
    },
    {
      id: 'ord-004',
      orderNumber: 'ORD-2025-00139',
      userId: 'usr-004',
      patientId: 'pat-004',
      posId: 'Sede Principal',
      status: 'COMPLETED',
      total: 156000,
      items: [
        { serviceId: 'LAB-002', serviceName: 'Perfil Lipídico', quantity: 1, unitPrice: 78000, total: 78000 },
        { serviceId: 'LAB-004', serviceName: 'Glucosa en Ayunas', quantity: 1, unitPrice: 25000, total: 25000 },
        { serviceId: 'LAB-001', serviceName: 'Hemograma Completo', quantity: 1, unitPrice: 53000, total: 53000 },
      ],
      walkInTicketCode: 'WALK-JKL012',
      walkInTicketExpiry: '2025-02-16T16:00:00',
      paymentStatus: 'PAID',
      createdAt: '2025-02-16T10:45:00',
    },
    {
      id: 'ord-005',
      orderNumber: 'ORD-2025-00138',
      userId: 'usr-005',
      patientId: 'pat-005',
      posId: 'Sucursal Sur',
      status: 'CANCELLED',
      total: 67000,
      items: [
        { serviceId: 'LAB-005', serviceName: 'Uroanálisis', quantity: 1, unitPrice: 35000, total: 35000 },
        { serviceId: 'LAB-004', serviceName: 'Glucosa en Ayunas', quantity: 1, unitPrice: 32000, total: 32000 },
      ],
      walkInTicketCode: 'WALK-MNO345',
      walkInTicketExpiry: '2025-02-15T12:00:00',
      paymentStatus: 'REFUNDED',
      createdAt: '2025-02-15T09:00:00',
    },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    // MOCK INTEGRATION: API - Using sample data for MVP
    // In production: this.apiService.getOrders(...).subscribe(...)
    setTimeout(() => {
      this.orders = [...this.sampleOrders];
      this.filterOrders();
      this.loading = false;
    }, 500);
  }

  filterOrders(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    const query = this.searchQuery.toLowerCase();
    this.filteredOrders = this.orders.filter(o => 
      o.orderNumber.toLowerCase().includes(query)
    );
  }

  onSearch(): void {
    this.filterOrders();
  }

  toggleExpand(order: ExpandedOrder): void {
    order.expanded = !order.expanded;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'COMPLETED': 'Completada',
      'CANCELLED': 'Cancelada',
    };
    return labels[status] || status;
  }

  getPaymentStatusClass(status?: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'REFUNDED': 'bg-gray-100 text-gray-800',
    };
    return classes[status || ''] || 'bg-gray-100 text-gray-800';
  }

  getPaymentStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'REFUNDED': 'Reembolsado',
    };
    return labels[status || ''] || status || 'N/A';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
