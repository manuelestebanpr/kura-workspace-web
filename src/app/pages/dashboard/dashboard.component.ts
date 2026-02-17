import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

interface RecentOrder {
  orderNumber: string;
  patient: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  labName = 'Laboratorio Central KURA';

  stats: StatCard[] = [
    { title: 'Total Órdenes', value: '142', trend: '+12%', trendUp: true },
    { title: 'Órdenes Pendientes', value: '23', trend: '-5%', trendUp: false },
    { title: 'Servicios Activos', value: '38' },
    { title: 'Inventario Bajo', value: '5', alert: true },
  ];

  recentOrders: RecentOrder[] = [
    { orderNumber: 'ORD-2025-00142', patient: 'María González', date: '2025-02-17', status: 'PENDING', total: 125000 },
    { orderNumber: 'ORD-2025-00141', patient: 'Carlos Rodríguez', date: '2025-02-17', status: 'CONFIRMED', total: 89000 },
    { orderNumber: 'ORD-2025-00140', patient: 'Ana Martínez', date: '2025-02-16', status: 'COMPLETED', total: 245000 },
    { orderNumber: 'ORD-2025-00139', patient: 'Luis Pérez', date: '2025-02-16', status: 'COMPLETED', total: 156000 },
    { orderNumber: 'ORD-2025-00138', patient: 'Carmen López', date: '2025-02-15', status: 'CANCELLED', total: 67000 },
  ];

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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }
}
