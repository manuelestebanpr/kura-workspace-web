import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// TODO: This page reads from warehouse_inventory which isn't exposed via API yet
// When API is ready, replace hardcoded data with ApiService calls

interface InventoryItem {
  id: string;
  name: string;
  pos: string;
  currentStock: number;
  minimumThreshold: number;
}

type StockStatus = 'OK' | 'LOW' | 'CRITICAL';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  // Hardcoded sample data for MVP
  // TODO: Replace with API call when warehouse_inventory endpoint is available
  inventoryItems: InventoryItem[] = [
    { id: 'INV-001', name: 'Tubos Vacutainer EDTA', pos: 'Sede Principal', currentStock: 150, minimumThreshold: 50 },
    { id: 'INV-002', name: 'Tubos Vacutainer Seco', pos: 'Sede Principal', currentStock: 200, minimumThreshold: 100 },
    { id: 'INV-003', name: 'Tubos Vacutainer Citrate', pos: 'Sede Principal', currentStock: 45, minimumThreshold: 50 },
    { id: 'INV-004', name: 'Agujas 21G', pos: 'Sede Principal', currentStock: 300, minimumThreshold: 100 },
    { id: 'INV-005', name: 'Gasas Estériles', pos: 'Sede Principal', currentStock: 80, minimumThreshold: 100 },
    { id: 'INV-006', name: 'Alcohol Antiséptico 1000ml', pos: 'Sede Principal', currentStock: 12, minimumThreshold: 20 },
    { id: 'INV-007', name: 'Lancetas', pos: 'Sucursal Norte', currentStock: 500, minimumThreshold: 200 },
    { id: 'INV-008', name: 'Portaobjetos', pos: 'Sede Principal', currentStock: 25, minimumThreshold: 50 },
    { id: 'INV-009', name: 'Cubreobjetos', pos: 'Sede Principal', currentStock: 1500, minimumThreshold: 500 },
    { id: 'INV-010', name: 'Reactivo Glucosa', pos: 'Sede Principal', currentStock: 8, minimumThreshold: 10 },
  ];

  loading = false;

  ngOnInit(): void {
    // TODO: Load from API when available
    // this.loadInventory();
  }

  getStatus(item: InventoryItem): StockStatus {
    if (item.currentStock < item.minimumThreshold) {
      return 'CRITICAL';
    }
    if (item.currentStock < item.minimumThreshold * 2) {
      return 'LOW';
    }
    return 'OK';
  }

  getStatusClass(status: StockStatus): string {
    const classes: Record<StockStatus, string> = {
      'OK': 'bg-emerald-100 text-emerald-800',
      'LOW': 'bg-amber-100 text-amber-800',
      'CRITICAL': 'bg-red-100 text-red-800',
    };
    return classes[status];
  }

  getStatusLabel(status: StockStatus): string {
    const labels: Record<StockStatus, string> = {
      'OK': 'OK',
      'LOW': 'Bajo',
      'CRITICAL': 'Crítico',
    };
    return labels[status];
  }

  getCriticalCount(): number {
    return this.inventoryItems.filter(item => this.getStatus(item) === 'CRITICAL').length;
  }

  getLowCount(): number {
    return this.inventoryItems.filter(item => this.getStatus(item) === 'LOW').length;
  }
}
