import { Route, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdminComponent } from './content/Admin/dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileAdminComponent } from './content/Admin/profile/profile.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { LoginGuard } from './guard/login.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardSuperAdminComponent } from './content/SuperAdmin/dashboard/dashboard.component';
import { StudentsComponent } from './content/Admin/students/students.component';
import { SchoolsComponent } from './content/SuperAdmin/schools/schools.component';
import { DriversComponent } from './content/SuperAdmin/drivers/drivers.component';
import { VehiclesComponent } from './content/SuperAdmin/vehicles/vehicles.component';
import { RoutesComponent } from './content/SuperAdmin/routes/routes.component';
import { DashboardParentComponent } from './content/Parent/dashboard/dashboard.component';
import { ProfileParentComponent } from './content/Parent/profile/profile.component';
import { UsersComponent } from './content/SuperAdmin/superadmin/users.component';
import { AdminsComponent } from './content/SuperAdmin/admins/admins.component';

const superAdminChildrenRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardSuperAdminComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { breadcrumb: 'Users' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'schools',
    component: SchoolsComponent,
    data: { breadcrumb: 'Schools' },
  },
  {
    path: 'admins',
    component: AdminsComponent,
    data: { breadcrumb: 'Admin' },
  },
  {
    path: 'drivers',
    component: DriversComponent,
  },
  {
    path: 'vehicles',
    component: VehiclesComponent,
  },
  {
    path: 'routes',
    component: RoutesComponent,
  },
];

const adminChildrenRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardAdminComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'students',
    component: StudentsComponent,
    data: { breadcrumb: 'Students' },
  },
  {
    path: 'profile',
    component: ProfileAdminComponent,
  },
];

const parentChildrenRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardParentComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'profile',
    component: ProfileParentComponent,
  },
];

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoginGuard],
  },
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'admin',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: adminChildrenRoutes,
  },
  {
    path: 'superadmin',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: superAdminChildrenRoutes,
  },
  {
    path: 'parent',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: parentChildrenRoutes,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
