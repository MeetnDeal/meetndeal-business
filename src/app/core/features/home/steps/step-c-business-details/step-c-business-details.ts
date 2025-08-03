// step-c-business-details.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './step-c-business-details.html',
  styleUrls: ['./step-c-business-details.css']
})
export class BusinessDetailsComponent implements OnInit {
  @Input() vendorForm!: FormGroup;
  @Input() currentStep: 'C' | 'D' | 'E' = 'C';
  @Output() goToStep = new EventEmitter<'A' | 'B' | 'C' | 'D' | 'E'>();
  @Output() finalSubmit = new EventEmitter<void>();

  filteredProfessions: string[] = [];
  filteredServices: string[] = [];

  professionMap: { [key: string]: string[] } = {
    Homes: ['Electrician', 'Plumber', 'Carpenter'],
    Beauty: ['Hair Stylist', 'Makeup Artist'],
    'Pandit Jee': ['Havan Expert', 'Wedding Pandit']
  };

  serviceMap: { [key: string]: string[] } = {
    Electrician: ['Fan Repair', 'Light Fixing', 'AC Repair'],
    Plumber: ['Leak Fix', 'Tap Installation'],
    Carpenter: ['Furniture Repair', 'Custom Cabinets'],
    'Hair Stylist': ['Haircut', 'Beard Trim'],
    'Makeup Artist': ['Bridal Makeup', 'Casual Look'],
    'Havan Expert': ['Navgrah Pooja', 'Vastu Shanti'],
    'Wedding Pandit': ['Vivah Sanskar', 'Kundli Matching']
  };

  ngOnInit(): void {
    const business = this.vendorForm.get('businessDetails');
    business?.get('category')?.valueChanges.subscribe((category) => {
      this.filteredProfessions = this.professionMap[category] || [];
      business.get('profession')?.reset();
      this.filteredServices = [];
    });

    business?.get('profession')?.valueChanges.subscribe((profession) => {
      this.filteredServices = this.serviceMap[profession] || [];
    });
  }

  onFileSelect(event: Event, controlPath: string) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.vendorForm.get(controlPath)?.setValue(file.name); // Replace with actual URL logic if needed
    }
  }

  onFinalSubmit() {
    if (this.vendorForm.valid) {
      this.finalSubmit.emit();
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }
}