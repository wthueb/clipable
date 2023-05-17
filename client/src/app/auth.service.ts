import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, shareReplay, tap } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../environments/environment';
import { LoginResponse } from './_models/api-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username: string = localStorage.getItem('username') ?? '';

  constructor(private http: HttpClient) {}

  private onResponse(res: LoginResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);

    this.username = res.username;

    if (res.expiresIn) {
      const expires = moment().add(res.expiresIn, 'second');

      localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => this.onResponse(res)),
        shareReplay()
      );
  }

  register(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/register`, {
        username,
        password,
      })
      .pipe(
        tap((res) => this.onResponse(res)),
        shareReplay()
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expires');

    this.username = '';

    location.reload();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    if (!token) return false;

    const expiration = localStorage.getItem('expires');

    if (!expiration) {
      return true;
    }

    const expiresAt = JSON.parse(expiration);

    return moment().isBefore(expiresAt);
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
}
