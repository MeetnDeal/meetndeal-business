import { Routes } from '@angular/router';
import { DashboardComponent } from './core/features/dashboard/dashboard';
import { HomeComponent } from './core/features/home/home';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: HomeComponent },
];

