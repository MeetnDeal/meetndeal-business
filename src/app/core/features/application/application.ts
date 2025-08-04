import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './application.html',
  styleUrls: ['./application.css']
})
export class ApplicationComponent {
  private router = inject(Router);
  private apiService = inject(ApiService);

  get isLoggedIn(): boolean {
    return this.apiService.isAuthenticated();
  }

  get userMobile(): string | null {
    return sessionStorage.getItem('mobile');
  }

  get vendorId(): string | null {
    return this.apiService.getVendorId();
  }

  goBack(): void {
    this.router.navigateByUrl('/join-us-partner');
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigateByUrl('/join-us-partner');
  }

  // Mock data - replace with real API call
  get applicationStatus(): any {
    // For now, return mock data. In real implementation, call API to get status
    return {
      hasApplication: false, // Set to true if user has submitted application
      status: 'NO_APPLICATION',
      message: 'No applications found for this account.',
      registrationNumber: null,
      submittedDate: null
    };
  }
} 