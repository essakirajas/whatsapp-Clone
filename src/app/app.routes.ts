// app.routes.ts or wherever your routes are defined
import { Routes } from '@angular/router';
import { PhoneNoComponent } from './components/login/phone-no/phone-no.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: PhoneNoComponent },
  { path: 'code', component: PhoneNoComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
];
