import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarOpen = false;
  pageTitle = 'Dashboard';

  navItems = [
    { label: 'Dashboard', icon: '📊', route: '/', exact: true },
    { label: 'Catálogo', icon: '🧪', route: '/catalog', exact: false },
    { label: 'Inventario', icon: '📦', route: '/inventory', exact: false },
    { label: 'Órdenes', icon: '🛒', route: '/orders', exact: false },
    { label: 'Resultados', icon: '📋', route: '/results', exact: false },
    { label: 'Importar Pacientes', icon: '📤', route: '/import', exact: false },
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
