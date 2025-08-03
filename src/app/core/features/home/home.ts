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

  tempVendorId = '5162144192607717'; // Auto-generated unique ID
  
  vendorForm: FormGroup = this.fb.group({
    basicInfo: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      alternateMobile: ['', [Validators.pattern(/^(\+91)?[6-9]\d{9}$/)]],
      address: this.fb.group({
        houseNumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        state: ['', [Validators.required]],
        country: ['India', [Validators.required]],
        pinCode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
        landmark: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
      }),
      profilePhotoUrl: [null, [Validators.required]]
    }),
    identityVerification: this.fb.group({
      aadharNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/)]],
      aadharDocUrl: ['', [Validators.required]],
      panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      panDocUrl: ['', [Validators.required]],
      drivingLicenseUrl: ['']
    }),
    businessDetails: this.fb.group({
      category: ['', [Validators.required]],
      profession: ['', [Validators.required]],
      servicesOffered: [[], [Validators.required, Validators.minLength(1)]],
      experience: ['', [Validators.required]],
      experienceCertUrl: ['']
    }),
    availability: this.fb.group({
      workingHours: this.fb.group({
        start: ['', [Validators.required]],
        end: ['', [Validators.required]]
      }),
      onCallEmergency: [false, [Validators.required]]
    }),
    paymentDetails: this.fb.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      upiId: ['', [Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/)]]
    }),
    welcomeKit: this.fb.group({
      tshirtSize: ['', [Validators.required]]
    }),
    agreements: this.fb.group({
      pricingPolicyAccepted: [false, [Validators.requiredTrue]],
      termsConditionsAccepted: [false, [Validators.requiredTrue]]
    })
  });
  get basicInfoForm(): FormGroup {
    return this.vendorForm.get('basicInfo') as FormGroup;
  }
  
  get identityVerificationForm(): FormGroup {
    return this.vendorForm.get('identityVerification') as FormGroup;
  }

  get paymentDetailsForm(): FormGroup {
    const paymentForm = this.fb.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      upiId: ['', [Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/)]],
      tshirtSize: ['', [Validators.required]],
      pricingPolicyAccepted: [false, [Validators.requiredTrue]],
      termsConditionsAccepted: [false, [Validators.requiredTrue]]
    });
    
    // Sync with main form
    paymentForm.valueChanges.subscribe(value => {
      this.vendorForm.patchValue({
        paymentDetails: {
          accountHolderName: value.accountHolderName,
          accountNumber: value.accountNumber,
          ifscCode: value.ifscCode,
          upiId: value.upiId
        },
        welcomeKit: {
          tshirtSize: value.tshirtSize
        },
        agreements: {
          pricingPolicyAccepted: value.pricingPolicyAccepted,
          termsConditionsAccepted: value.termsConditionsAccepted
        }
      });
    });
    
    return paymentForm;
  }

  handleToggleChange() {
    if (this.registrationType === 'Business') {
      this.showBusinessModal = true;
    }
  }

  continueAsIndividual() {
    this.registrationType = 'Individual';
    this.showBusinessModal = false;
  }

  onFileSelect(event: any, fieldName?: string) {
    const file = event.target?.files?.[0];
    if (file && fieldName) {
      const control = this.vendorForm.get(fieldName);
      if (control) control.setValue(file.name);
    }
  }

  goToStep(step: 'A' | 'B' | 'C' | 'D' | 'E') {
    // Add smooth scrolling to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentStep = step;
  }

  showSuccessModal = false;
  registrationNumber = '';

  onFinalSubmit() {
    if (this.vendorForm.valid) {
      // Prepare the payload according to the API structure
      const payload = {
        tempVendorId: this.tempVendorId,
        basicInfo: this.vendorForm.get('basicInfo')?.value,
        identityVerification: this.vendorForm.get('identityVerification')?.value,
        businessDetails: this.vendorForm.get('businessDetails')?.value,
        availability: this.vendorForm.get('availability')?.value,
        paymentDetails: this.vendorForm.get('paymentDetails')?.value,
        welcomeKit: this.vendorForm.get('welcomeKit')?.value,
        agreements: this.vendorForm.get('agreements')?.value
      };
      
      console.log('Form Submitted:', payload);
      
      // Mock API response
      setTimeout(() => {
        this.registrationNumber = '250331079009';
        this.showSuccessModal = true;
      }, 1000);
    } else {
      this.vendorForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields before submitting.', 'Okay', { duration: 4000 });
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    // Reset form and go to step A
    this.vendorForm.reset();
    this.currentStep = 'A';
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}