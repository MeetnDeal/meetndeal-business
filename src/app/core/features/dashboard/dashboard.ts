import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule]
})
export class DashboardComponent {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private apiService = inject(ApiService);

  userInitial = 'S'; // Default initial

  get isLoggedIn(): boolean {
    return this.apiService.isAuthenticated();
  }

  get userMobile(): string | null {
    return sessionStorage.getItem('mobile');
  }

  get vendorId(): string | null {
    return this.apiService.getVendorId();
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
    this.router.navigateByUrl('/business-registration');
  }

  viewApplication(): void {
    this.router.navigateByUrl('/application');
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigateByUrl('/join-us-partner');
  }

  goToMainPage(): void {
    this.router.navigateByUrl('/join-us-partner');
  }
}