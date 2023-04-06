import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { KeyValue } from '@angular/common';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
})
export class SponsorsPage implements OnInit {
  sponsors: any;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) { }

  levelOrder(a: KeyValue<string,any>, b: KeyValue<string,any>): number {
    return a.value[0].level_order < b.value[0].level_order ? -1 : (b.value[0].level_order < a.value[0].level_order ? 1 : 0);
  }

  updateSponsors() {
    this.confData.getSponsors().subscribe((sponsors: any[]) => {
      this.sponsors = sponsors;
    });
  }

  reloadSponsors() {
    this.loadingCtrl.create({
      message: 'Fetching latest...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.confData.getSponsors().subscribe((sponsors: any[]) => {
        this.sponsors = sponsors;
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  ngOnInit() {
    this.reloadSponsors();
  }

}
