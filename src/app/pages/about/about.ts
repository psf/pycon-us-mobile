import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage {
  current: any = null;

  constructor(
    private loadingCtrl: LoadingController,
    public liveUpdateService: LiveUpdateService,
  ) {}

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
}
