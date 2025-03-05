import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-about-pycon',
  templateUrl: './about-pycon.page.html',
  styleUrls: ['./about-pycon.page.scss'],
})
export class AboutPyconPage implements OnInit {
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

  async checkForUpdate() {
    this.liveUpdateService.checkForUpdate();
  }

  async performAutomaticUpdate() {
   this.loadingCtrl.create({
    message: 'Installing the latest build...',
    duration: 60000,
   }).then((loader) => {
     loader.present();
     if (this.liveUpdateService.needsUpdate) {
         this.liveUpdateService.reload();
         setTimeout(() => {loader.dismiss()}, 1000);
     } else {
         setTimeout(() => {loader.dismiss()}, 1000);
     }
   }).catch((err) => {
     console.log(err);
   });
  }

  ngOnInit() {
    this.liveUpdateService.checkForUpdate();
    this.reloadContent();
  }
}
