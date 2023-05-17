import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../environments/environment';

import { Clip, UserResponse, UploadResponse } from './_models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(username: string): Observable<UserResponse> {
    return this.http
      .get<UserResponse>(`${this.apiUrl}/user/${username}`)
      .pipe(
        map((user) => {
          user.clips.forEach((clip) => {
            const url = `${this.apiUrl}${clip.url}`;
            clip.url = url;
          });
          return user;
        })
      );
  }

  getClip(key: string): Observable<Clip> {
    return this.http.get<Clip>(`${this.apiUrl}/clip/${key}`).pipe(
      map((clip) => {
        const url = `${this.apiUrl}${clip.url}`;
        clip.url = url;
        return clip;
      })
    );
  }

  uploadClip(clip: File): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('clip', clip);

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
