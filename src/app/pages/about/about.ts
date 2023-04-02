import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Deploy } from 'cordova-plugin-ionic/dist/ngx';



@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements OnInit {
  current: any = null;
  availableUpdate: any = null;
  deploy: Deploy;

  constructor(
    private loadingCtrl: LoadingController,
  ) {}

  async performAutomaticUpdate() {
   this.loadingCtrl.create({
    message: 'Installing the latest build...',
    duration: 60000,
   }).then((loader) => {
     loader.present();
     try {
       this.deploy.getCurrentVersion().then((currentVersion) => {
         console.log(currentVersion);
         this.deploy.sync({updateMethod: 'auto'}).then((resp) => {
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

  async ngOnInit() {
    this.deploy = new Deploy();
    this.deploy.configure({});
    this.availableUpdate = await this.deploy.checkForUpdate()
    console.log(this.availableUpdate);
  }
}
