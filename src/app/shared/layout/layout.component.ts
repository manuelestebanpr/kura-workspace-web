import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarOpen = false;

  navItems = [
    { labelKey: 'NAV.DASHBOARD', icon: '📊', route: '/', exact: true },
    { labelKey: 'NAV.CATALOG', icon: '🧪', route: '/catalog', exact: false },
    { labelKey: 'NAV.INVENTORY', icon: '📦', route: '/inventory', exact: false },
    { labelKey: 'NAV.ORDERS', icon: '🛒', route: '/orders', exact: false },
    { labelKey: 'NAV.RESULTS', icon: '📋', route: '/results', exact: false },
    { labelKey: 'NAV.IMPORT', icon: '📤', route: '/import', exact: false },
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
}
