import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  error: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  submit() {
    if (this.form.valid) {
      this.auth
        .login(this.form.value.username, this.form.value.password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl(
              this.activatedRoute.snapshot.queryParams['redirect'] ?? '/'
            );
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.error = 'Invalid username or password';
            } else {
              this.error = 'An unknown error occurred';
            }
          },
        });
    }
  }
}
