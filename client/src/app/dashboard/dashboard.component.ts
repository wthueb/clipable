import { Component, OnInit } from '@angular/core';

import { BackendService } from '../backend.service';
import { AuthService } from '../auth.service';
import { Clip } from '../_models/api-response';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  clips: Clip[] = [];
  baseUrl = environment.baseUrl;

  constructor(private backend: BackendService, private auth: AuthService) {
    this.backend.getUser(this.auth.username).subscribe((user) => {
      this.clips = user.clips;
    });
  }

  deleteClip(key: string): void {
    // TODO
  }

  ngOnInit(): void {}
}
