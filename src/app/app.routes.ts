import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'catalog',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/catalog/catalog-list/catalog-list.component').then(m => m.CatalogListComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/catalog/catalog-create/catalog-create.component').then(m => m.CatalogCreateComponent),
      },
    ],
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
  },
  {
    path: 'import',
    loadComponent: () => import('./pages/import/import.component').then(m => m.ImportComponent),
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent),
  },
  {
    path: 'inventory',
    loadComponent: () => import('./pages/inventory/inventory.component').then(m => m.InventoryComponent),
  },
  { path: '**', redirectTo: '' },
];
