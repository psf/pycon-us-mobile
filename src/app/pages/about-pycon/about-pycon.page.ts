import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

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

  async performAutomaticUpdate() {
   this.loadingCtrl.create({
    message: 'Installing the latest build...',
    duration: 60000,
   }).then((loader) => {
     loader.present();
     try {
       this.liveUpdateService.deploy.getCurrentVersion().then((currentVersion) => {
         console.log(currentVersion);
         this.liveUpdateService.deploy.sync({updateMethod: 'auto'}).then((resp) => {
           setTimeout(() => {loader.dismiss()}, 1000);
           if (!currentVersion || currentVersion.versionId !== resp.versionId){
             // We found an update, and are in process of redirecting you since you put auto!
           }else{
             // No update available
           }
           return resp;
         });
       }).catch((err) => {
         console.log(err)
       })
     } catch (err) {
       console.log(err)
     }
   }).catch((err) => {
     console.log(err);
   });
  }

  ngOnInit() {
    this.reloadContent();
  }
}
