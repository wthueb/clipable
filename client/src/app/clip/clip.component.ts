import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BackendService } from '../backend.service';
import { Clip } from '../_models/api-response';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
})
export class ClipComponent implements OnInit {
  key: string = '';
  clipInfo: Clip | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private backend: BackendService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.key = params['key'];
      this.clipInfo = undefined;

      if (!this.key) {
        this.router.navigate(['/notfound'], { skipLocationChange: true });
        return;
      }

      this.backend.getClip(this.key).subscribe({
        next: (clipInfo) => {
          this.clipInfo = clipInfo;
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/notfound'], { skipLocationChange: true });
          return;
        },
      });
    });
  }
}
