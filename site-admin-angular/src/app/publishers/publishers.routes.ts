import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { RegisterComponent } from './register/register.component';

export const publishersRoutes: Routes = [
  {
    path: 'add',
    component: RegisterComponent
  },
  {
    path: ':id/edit',
    component: RegisterComponent
  },
  {
    path: '**',
    component: ListComponent
  }
];
