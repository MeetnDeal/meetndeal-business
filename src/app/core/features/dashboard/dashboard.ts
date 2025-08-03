import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, MatToolbarModule, MatButtonModule]
})
export class DashboardComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('mobile');
  }

  get userMobile(): string | null {
    return sessionStorage.getItem('mobile');
  }

  openLogin(): void {
    this.dialog.open(LoginDialogComponent, {
      width: 'auto',
      maxWidth: '90vw',
      panelClass: 'custom-login-dialog',
      autoFocus: true,
      disableClose: false
    });
  }

  register(): void {
    this.router.navigateByUrl('/dashboard'); // or '/register' if you want a separate route
  }

  viewApplication(): void {
    this.router.navigateByUrl('/application'); // Placeholder, implement this route/component
  }

  logout(): void {
    sessionStorage.removeItem('mobile');
    this.router.navigateByUrl('/');
  }
}