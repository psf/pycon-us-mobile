import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.page.html',
  styleUrls: ['./social-media.page.scss'],
})
export class SocialMediaPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  constructor(
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
