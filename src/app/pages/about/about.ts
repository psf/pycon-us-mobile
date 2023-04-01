import { Component, OnInit } from '@angular/core';

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
  ) {}

  async performAutomaticUpdate() {
   try {
     const currentVersion = await this.deploy.getCurrentVersion();
     const resp = await this.deploy.sync({updateMethod: 'auto'}, percentDone => {
       console.log(`Update is ${percentDone}% done!`);
     });
     if (!currentVersion || currentVersion.versionId !== resp.versionId){
       // We found an update, and are in process of redirecting you since you put auto!
     }else{
       // No update available
     }
   } catch (err) {
     // We encountered an error.
   }
  }

  async ngOnInit() {
    this.deploy = new Deploy();
    this.deploy.configure({});
    this.availableUpdate = await this.deploy.checkForUpdate()
    console.log(this.availableUpdate);
  }
}
