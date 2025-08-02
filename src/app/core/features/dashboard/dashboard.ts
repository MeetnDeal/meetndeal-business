import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { LoginDialogComponent } from '../auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [MatToolbarModule, MatButtonModule]
})
export class DashboardComponent {
  private dialog = inject(MatDialog);

  openLogin(): void {
this.dialog.open(LoginDialogComponent, {
  width: 'auto',                // Let it size to content
  maxWidth: '90vw',             // Prevent overflow on small screens
  panelClass: 'custom-login-dialog',
  autoFocus: true,
  disableClose: false
});
  }
}