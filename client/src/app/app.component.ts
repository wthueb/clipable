import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(protected auth: AuthService, private router: Router) {}

  gotoLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { redirect: this.router.url },
    });
  }

  gotoRegister(): void {
    this.router.navigate(['/register'], {
      queryParams: { redirect: this.router.url },
    });
  }

  loggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
  }
}
