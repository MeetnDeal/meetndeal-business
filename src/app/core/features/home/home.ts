import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule
  ]
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  mobile = sessionStorage.getItem('mobile');
  userInitial = 'S';

  // ⛳ Reactive Form
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
    })
  });

  // 🧠 Registration toggle
  registrationType = 'Individual'; // default selection
  currentStep = 'A'; // start with Step A

  handleToggleChange() {
    if (this.registrationType === 'Business') {
      this.snackBar.open(
        'We are not accepting registration for business owners yet. Please register as Individual or contact support@meetndeal.com.',
        'Okay',
        { duration: 6000 }
      );
      this.registrationType = 'Individual';
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vendorForm.get('basicInfo.profilePhotoUrl')?.setValue(file);
    }
  }

  goToStep(step: string) {
    this.currentStep = step;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}