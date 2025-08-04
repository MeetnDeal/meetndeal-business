import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class OtpDialogComponent {
  otp: string = '';
  loading = false;
  isInvalid = false;
  errorMessage: string = '';

  readonly expectedOtp = '123456'; // Mock OTP for testing

  dialogRef = inject(MatDialogRef<OtpDialogComponent>);
  mobile = inject(MAT_DIALOG_DATA); // receives mobile number passed from login dialog
  private router = inject(Router);
  private apiService = inject(ApiService);

  verifyOtp(): void {
    if (this.otp !== this.expectedOtp) {
      this.isInvalid = true;
      this.errorMessage = 'Oops! The OTP you entered is incorrect. Please try again.';
      setTimeout(() => {
        this.isInvalid = false;
        this.errorMessage = '';
      }, 3000);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Call real API for OTP verification
    this.apiService.verifyOtp(this.mobile, this.otp).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response) => {
        console.log('OTP verification response:', response);
        
        if (response.status === 'VERIFIED') {
          this.dialogRef.close(true);
          this.router.navigateByUrl('/join-us-partner');
        } else {
          this.isInvalid = true;
          this.errorMessage = response.message || 'OTP verification failed';
        }
      },
      error: (error) => {
        console.error('OTP verification error:', error);
        this.isInvalid = true;
        this.errorMessage = error.message || 'OTP verification failed. Please try again.';
      }
    });
  }
}