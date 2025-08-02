import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { Router } from '@angular/router';

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

  public dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  proceedToOtp(): void {
    const trimmed = this.mobileNumber.trim();
    const isValid = /^\d{10}$/.test(trimmed);

    this.isInvalid = !isValid;

    if (!isValid) return;

    this.loading = true;

    // Simulate API call delay
    setTimeout(() => {
      this.dialogRef.close();

      const otpRef = this.dialog.open(OtpDialogComponent, {
        width: '350px',
        data: trimmed
      });

      otpRef.afterClosed().subscribe((success) => {
        this.loading = false;
        if (success) {
          this.router.navigateByUrl('/dashboard');
        }
      });
    }, 1000);
  }
}