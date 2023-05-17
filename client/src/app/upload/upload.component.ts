import { Component } from '@angular/core';
import {
  HttpEventType,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  clipName: string = '';
  uploadProgress: number = 0;
  hovered: boolean = false;

  constructor(
    private backend: BackendService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  setHovered(value: boolean): void {
    this.hovered = value;
  }

  uploadClip(clip: File): void {
    if (clip.size > environment.maxClipSize) {
      return;
    }

    // TODO: open Dialog to show upload progress with progress bar
    this.clipName = clip.name;

    this.backend.uploadClip(clip).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total!);
        } else if (event.type === HttpEventType.Response) {
          if (!event.body) {
            console.error('no body in upload response');
            return;
          }
          const { key } = event.body;
          this.router.navigate(['', key]);
        }
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            this.snackBar.open('You must be logged in to upload a clip.', 'OK');
            break;
          case HttpStatusCode.PayloadTooLarge:
            this.snackBar.open('Clip is too large.', 'OK');
            break;
          default:
            console.log(error);
        }
      },
    });
  }
}
