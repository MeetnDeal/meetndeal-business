// File: home.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// Import step components
import { StepABasicInfoComponent } from './steps/step-a-basic-info/step-a-basic-info';
import { StepBIdentityVerificationComponent } from './steps/step-b-identity-verification/step-b-identity-verification';
import { BusinessDetailsComponent } from './steps/step-c-business-details/step-c-business-details';
import { StepEPaymentComponent } from './steps/step-e-payment/step-e-payment';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    StepABasicInfoComponent,
    StepBIdentityVerificationComponent,
    BusinessDetailsComponent,
    StepEPaymentComponent
  ]
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  userInitial = 'S';
  registrationType: 'Individual' | 'Business' = 'Individual';
  currentStep: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  showBusinessModal = false;

  vendorForm: FormGroup = this.fb.group({
    basicInfo: this.fb.group({
      name: ['', Validators.required],
      alternateMobile: [''],
      address: this.fb.group({
        houseNumber: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['India', Validators.required],
        pinCode: ['', Validators.required],
        landmark: ['']
      }),
      profilePhotoUrl: [null, Validators.required]
    }),
    identityVerification: this.fb.group({
      aadharNumber: ['', Validators.required],
      aadharDocUrl: [''],
      panNumber: ['', Validators.required],
      panDocUrl: [''],
      drivingLicenseUrl: ['']
    }),
    businessDetails: this.fb.group({
      category: ['', Validators.required],
      profession: ['', Validators.required],
      servicesOffered: [[], Validators.required],
      experience: ['', Validators.required],
      experienceCertUrl: ['']
    }),
    availability: this.fb.group({
      workingHours: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      }),
      onCallEmergency: [false]
    }),
    paymentDetails: this.fb.group({
      accountHolderName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      upiId: ['']
    }),
    welcomeKit: this.fb.group({
      tshirtSize: ['']
    }),
    agreements: this.fb.group({
      pricingPolicyAccepted: [false, Validators.requiredTrue],
      termsConditionsAccepted: [false, Validators.requiredTrue]
    })
  });
  get basicInfoForm(): FormGroup {
    return this.vendorForm.get('basicInfo') as FormGroup;
  }
  
  get identityVerificationForm(): FormGroup {
    return this.vendorForm.get('identityVerification') as FormGroup;
  }

  get paymentDetailsForm(): FormGroup {
    return this.vendorForm.get('paymentDetails') as FormGroup;
  }

  handleToggleChange() {
    if (this.registrationType === 'Business') {
      this.showBusinessModal = true;
      this.registrationType = 'Individual';
    }
  }

  onFileSelect(event: any, fieldName?: string) {
    const file = event.target?.files?.[0];
    if (file && fieldName) {
      const control = this.vendorForm.get(`identityVerification.${fieldName}`) ||
                      this.vendorForm.get(`businessDetails.${fieldName}`) ||
                      this.vendorForm.get(`basicInfo.${fieldName}`);
      if (control) control.setValue(file.name);
    }
  }

  goToStep(step: 'A' | 'B' | 'C' | 'D' | 'E') {
    this.currentStep = step;
  }

  onFinalSubmit() {
    if (this.vendorForm.valid) {
      console.log('Form Submitted:', this.vendorForm.value);
      this.snackBar.open('Registration submitted successfully!', 'Close', { duration: 4000 });
    } else {
      this.vendorForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields before submitting.', 'Okay', { duration: 4000 });
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}