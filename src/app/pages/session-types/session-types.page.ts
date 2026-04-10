import { Component } from '@angular/core';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-session-types',
  templateUrl: './session-types.page.html',
  styleUrls: ['./session-types.page.scss'],
})
export class SessionTypesPage {
  constructor(
    public liveUpdateService: LiveUpdateService,
  ) {}
}
