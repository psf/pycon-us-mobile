import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.page.html',
  styleUrls: ['./social-media.page.scss'],
})
export class SocialMediaPage implements OnInit {
  content: any = "";

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  reloadContent() {
    this.loadingCtrl.create({
      message: 'Fetching latest...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.confData.getContent().subscribe((content: any[]) => {
        this.content = content;
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  ngOnInit() {
    this.reloadContent();
  }
}
