import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, Service } from '../../../services/api.service';

interface ChildService {
  id: string;
  code: string;
  name: string;
}

@Component({
  selector: 'app-catalog-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './catalog-create.component.html',
  styleUrls: ['./catalog-create.component.scss']
})
export class CatalogCreateComponent implements OnInit {
  serviceForm!: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;
  showCustomWarning = false;
  
  // Available child services for bundles
  availableServices: ChildService[] = [
    { id: 'LAB-031', code: 'TSH', name: 'TSH' },
    { id: 'LAB-032', code: 'T3', name: 'T3 Libre' },
    { id: 'LAB-033', code: 'T4', name: 'T4 Libre' },
    { id: 'LAB-034', code: 'GLU', name: 'Glucosa' },
    { id: 'LAB-035', code: 'BUN', name: 'BUN' },
    { id: 'LAB-036', code: 'CREA', name: 'Creatinina' },
  ];
  
  selectedChildServices: ChildService[] = [];
  childServiceSearch = '';

  categories = [
    'Hematología',
    'Química Clínica',
    'Endocrinología',
    'Uroanálisis',
    'Inmunología',
    'Microbiología',
    'Parasitología',
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.serviceForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      serviceType: ['SINGLE', Validators.required],
      isCustom: [false],
    });

    // Watch for custom checkbox
    this.serviceForm.get('isCustom')?.valueChanges.subscribe(isCustom => {
      if (isCustom) {
        this.showCustomWarning = true;
      }
    });
  }

  get isBundle(): boolean {
    return this.serviceForm.get('serviceType')?.value === 'BUNDLE';
  }

  onTypeChange(): void {
    // Reset child services when switching types
    if (!this.isBundle) {
      this.selectedChildServices = [];
    }
  }

  addChildService(service: ChildService): void {
    if (!this.selectedChildServices.find(s => s.id === service.id)) {
      this.selectedChildServices.push(service);
    }
    this.childServiceSearch = '';
  }

  removeChildService(service: ChildService): void {
    this.selectedChildServices = this.selectedChildServices.filter(s => s.id !== service.id);
  }

  get filteredAvailableServices(): ChildService[] {
    if (!this.childServiceSearch.trim()) {
      return this.availableServices.filter(s => 
        !this.selectedChildServices.find(sel => sel.id === s.id)
      );
    }
    const query = this.childServiceSearch.toLowerCase();
    return this.availableServices.filter(s => 
      (s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)) &&
      !this.selectedChildServices.find(sel => sel.id === s.id)
    );
  }

  closeCustomWarning(): void {
    this.showCustomWarning = false;
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.serviceForm.value;
    const serviceData: Service = {
      code: formValue.code,
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      basePrice: formValue.basePrice,
      serviceType: formValue.serviceType,
      isCustom: formValue.isCustom,
      childServiceIds: this.isBundle ? this.selectedChildServices.map(s => s.id) : undefined,
    };

    // MOCK INTEGRATION: API - Simulating API call for MVP
    // In production: this.apiService.createService(serviceData).subscribe(...)
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      
      // Redirect after success
      setTimeout(() => {
        this.router.navigate(['/catalog']);
      }, 1500);
    }, 1000);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }
}
