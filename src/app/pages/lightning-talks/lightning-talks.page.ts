import { Component } from '@angular/core';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-lightning-talks',
  templateUrl: './lightning-talks.page.html',
  styleUrls: ['./lightning-talks.page.scss'],
})
export class LightningTalksPage {
  constructor(public liveUpdateService: LiveUpdateService) {}

  signUp() {
    window.open('https://us.pycon.org/2026/events/lightning-talks/', '_system', 'location=yes');
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
