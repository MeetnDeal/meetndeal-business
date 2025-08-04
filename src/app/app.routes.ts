import { Routes } from '@angular/router';
import { DashboardComponent } from './core/features/dashboard/dashboard';
import { HomeComponent } from './core/features/home/home';
import { ApplicationComponent } from './core/features/application/application';

export const routes: Routes = [
  { path: '', redirectTo: '/join-us-partner', pathMatch: 'full' },
  { path: 'join-us-partner', component: DashboardComponent },
  { path: 'business-registration', component: HomeComponent },
  { path: 'application', component: ApplicationComponent }
];

