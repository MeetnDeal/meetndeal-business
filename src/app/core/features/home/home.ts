// File: home.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StepABasicInfoComponent } from './steps/step-a-basic-info/step-a-basic-info';
import { StepBIdentityVerificationComponent } from './steps/step-b-identity-verification/step-b-identity-verification';
import { BusinessDetailsComponent } from './steps/step-c-business-details/step-c-business-details';
import { StepEPaymentComponent } from './steps/step-e-payment/step-e-payment';
import { ApiService, RegistrationRequest } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    StepABasicInfoComponent,
    StepBIdentityVerificationComponent,
    BusinessDetailsComponent,
    StepEPaymentComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private apiService = inject(ApiService);

  currentStep: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  registrationType = 'Individual';
  showBusinessModal = false;
  showSuccessModal = false;
  registrationNumber = '';
  userInitial = 'S'; // Default initial

  get userMobile(): string | null {
    return sessionStorage.getItem('mobile');
  }

  // Get vendor ID from API service
  get tempVendorId(): string {
    return this.apiService.getVendorId() || '5162144192607717'; // Fallback to mock ID
  }

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

  onFinalSubmit() {
    if (this.vendorForm.valid) {
      // Prepare the payload according to the API structure
      const formValue = this.vendorForm.value;
      
      const payload: RegistrationRequest = {
        tempVendorId: this.tempVendorId,
        basicInfo: {
          name: formValue.basicInfo.name,
          alternateMobile: formValue.basicInfo.alternateMobile,
          address: {
            houseNumber: formValue.basicInfo.address.houseNumber,
            street: formValue.basicInfo.address.street,
            city: formValue.basicInfo.address.city,
            state: formValue.basicInfo.address.state,
            country: formValue.basicInfo.address.country,
            pinCode: formValue.basicInfo.address.pinCode,
            landmark: formValue.basicInfo.address.landmark
          },
          profilePhotoUrl: formValue.basicInfo.profilePhotoUrl
        },
        identityVerification: {
          aadharNumber: formValue.identityVerification.aadharNumber,
          aadharDocUrl: formValue.identityVerification.aadharDocUrl,
          panNumber: formValue.identityVerification.panNumber,
          panDocUrl: formValue.identityVerification.panDocUrl,
          drivingLicenseUrl: formValue.identityVerification.drivingLicenseUrl
        },
        businessDetails: {
          category: formValue.businessDetails.category,
          profession: formValue.businessDetails.profession,
          services: formValue.businessDetails.servicesOffered.map((service: string, index: number) => ({
            serviceId: `SVC${String(index + 1).padStart(4, '0')}`,
            serviceName: service
          })),
          experience: formValue.businessDetails.experience,
          experienceCertUrl: formValue.businessDetails.experienceCertUrl
        },
        availability: {
          workingHours: {
            start: formValue.availability.workingHours.start,
            end: formValue.availability.workingHours.end
          },
          onCallEmergency: formValue.availability.onCallEmergency
        },
        paymentDetails: {
          accountHolderName: formValue.paymentDetails.accountHolderName,
          accountNumber: formValue.paymentDetails.accountNumber,
          ifscCode: formValue.paymentDetails.ifscCode,
          upiId: formValue.paymentDetails.upiId
        },
        welcomeKit: {
          tshirtSize: formValue.welcomeKit.tshirtSize
        },
        agreements: {
          pricingPolicyAccepted: formValue.agreements.pricingPolicyAccepted,
          termsConditionsAccepted: formValue.agreements.termsConditionsAccepted
        }
      };
      
      console.log('Registration payload:', payload);
      
      // Call registration API
      this.apiService.register(payload).subscribe({
        next: (response) => {
          console.log('Registration response:', response);
          this.registrationNumber = response.data.registration_number;
          this.showSuccessModal = true;
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.snackBar.open(error.message || 'Registration failed. Please try again.', 'Close', { duration: 4000 });
        }
      });
    } else {
      this.vendorForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields before submitting.', 'Okay', { duration: 4000 });
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    // Reset form and go to dashboard
    this.vendorForm.reset();
    this.currentStep = 'A';
    this.router.navigateByUrl('/join-us-partner');
  }

  logout() {
    this.apiService.logout();
    this.router.navigateByUrl('/join-us-partner');
  }

  goToMainPage() {
    this.router.navigateByUrl('/join-us-partner');
  }
}