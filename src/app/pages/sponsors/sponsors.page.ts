import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { KeyValue } from '@angular/common';
import { IonContent, LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.page.html',
  styleUrls: ['./sponsors.page.scss'],
})
export class SponsorsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;
  sponsors: any;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) { }

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

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

  getSponsorSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  ngOnInit() {
    this.reloadSponsors();
  }

}
