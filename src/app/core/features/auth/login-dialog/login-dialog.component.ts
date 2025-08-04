import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginDialogComponent {
  mobileNumber: string = '';
  loading = false;
  isInvalid = false;
  errorMessage: string = '';

  public dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private apiService = inject(ApiService);

  proceedToOtp(): void {
    const trimmed = this.mobileNumber.trim();
    
    // Remove +91 if user entered it, we'll add it in the API service
    let cleanNumber = trimmed;
    if (trimmed.startsWith('+91')) {
      cleanNumber = trimmed.substring(3);
    }
    
    // Validate 10-digit Indian mobile number
    const isValid = /^[6-9]\d{9}$/.test(cleanNumber);

    this.isInvalid = !isValid;
    this.errorMessage = '';

    if (!isValid) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      return;
    }

    this.loading = true;

    // Call real API with clean number (API service will add +91)
    console.log('User entered:', this.mobileNumber);
    console.log('Clean number:', cleanNumber);
    console.log('Will send to API:', '+91' + cleanNumber);
    
    this.apiService.login(cleanNumber).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        console.log('Login API response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response || {}));
        
        this.dialogRef.close();

        const otpRef = this.dialog.open(OtpDialogComponent, {
          width: '350px',
          data: cleanNumber // Pass clean number to OTP dialog
        });

        otpRef.afterClosed().subscribe((success) => {
          if (success) {
            this.router.navigateByUrl('/join-us-partner');
          }
        });
      },
      error: (error) => {
        console.error('Login API error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.errorMessage = error.message || 'Failed to send OTP. Please try again.';
        this.isInvalid = true;
      }
    });
  }
}