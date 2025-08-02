import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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

  readonly expectedOtp = '123456';

  dialogRef = inject(MatDialogRef<OtpDialogComponent>);
  mobile = inject(MAT_DIALOG_DATA); // receives mobile number passed from login dialog
  private router = inject(Router);

  verifyOtp(): void {
if (this.otp !== this.expectedOtp) {
  this.isInvalid = true;
  alert('Oops! The OTP you entered is incorrect. Please try again.');
  setTimeout(() => this.isInvalid = false, 3000); // clear error after 3 seconds
  return;
}

    this.loading = true;
  setTimeout(() => {
    this.loading = false;
    this.dialogRef.close(true); // success flag
    this.router.navigateByUrl('/dashboard');
  }, 1000);
}
}