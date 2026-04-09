import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.page.html',
  styleUrls: ['./sprints.page.scss'],
})
export class SprintsPage implements OnInit {
  sprints: any[] = [];

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
      this.confData.getSprints().subscribe((sprints: any[]) => {
        this.sprints = sprints;
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  ngOnInit() {
    this.reloadContent();
  }
}
