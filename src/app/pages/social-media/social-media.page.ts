import { Component } from '@angular/core';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.page.html',
  styleUrls: ['./social-media.page.scss'],
})
export class SocialMediaPage {
  constructor(
    public liveUpdateService: LiveUpdateService,
  ) {}

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
