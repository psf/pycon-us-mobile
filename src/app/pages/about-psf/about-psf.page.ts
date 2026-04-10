import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-about-psf',
  templateUrl: './about-psf.page.html',
  styleUrls: ['./about-psf.page.scss'],
})
export class AboutPsfPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  content: any = "";
  showTitle = false;

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

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }

  ngOnInit() {
    this.reloadContent();
  }
}
