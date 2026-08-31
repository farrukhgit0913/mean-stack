import { Routes } from '@angular/router';
import { UsersComponent } from './users/users';

export const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'users',
  },
];
