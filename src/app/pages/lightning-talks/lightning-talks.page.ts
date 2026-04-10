import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-lightning-talks',
  templateUrl: './lightning-talks.page.html',
  styleUrls: ['./lightning-talks.page.scss'],
})
export class LightningTalksPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  constructor(public liveUpdateService: LiveUpdateService) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  signUp() {
    window.open('https://us.pycon.org/2026/events/lightning-talks/', '_system', 'location=yes');
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
