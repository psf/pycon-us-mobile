import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import { Share } from '@capacitor/share';
import { encode } from 'js-base64';
import * as crypto from 'crypto-js';

import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about-pycon',
  templateUrl: './about-pycon.page.html',
  styleUrls: ['./about-pycon.page.scss'],
})
export class AboutPyconPage implements OnInit {
  content: any = "";
  loggedIn: boolean = false;
  environmentUrl: string = environment.baseUrl;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private userData: UserData,
    private changeDetection: ChangeDetectorRef,
    private storage: Storage,
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
    this.userData.isLoggedIn().then((resp) => {
      this.loggedIn = resp;
    });
  }

  async shareDebug() {
    let kvstore = []
    const email = await this.storage.get("email");
    const key = await this.storage.get("key");
    const secret = await this.storage.get("secret");
    await this.storage.forEach((value, key, index) => {
      kvstore.push([index, key, value]);
    });
    const dbdump = JSON.stringify(kvstore);
    const data = {
        email: email,
        key: key,
        state: encode(crypto.AES.encrypt(dbdump, secret).toString()),
    }
    const base64Data = encode(JSON.stringify(data));
    return Filesystem.writeFile({
      path: "pycon-db-dump-" + key + ".dat",
      data: base64Data,
      directory: Directory.Cache
    }).then(() => {
      return Filesystem.getUri({
        directory: Directory.Cache,
        path: 'pycon-db-dump-' + key + '.dat',
      });
    }).then((uriResult) => {
      return Share.share({
        title: "Share Debug Records with PyCon Staff",
        text: 'pycon-db-dump.dat',
        url: uriResult.uri,
      })
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
