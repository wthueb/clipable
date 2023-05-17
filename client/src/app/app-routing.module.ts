import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { loggedInGuard, notLoggedInGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notLoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [notLoggedInGuard],
  },
  { path: 'notfound', component: NotFoundComponent },
  {
    path: ':key',
    component: ClipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes /*, { enableTracing: true }*/)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
