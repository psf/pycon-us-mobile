import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { KeyValue } from '@angular/common';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'app-expo-hall',
  templateUrl: './expo-hall.page.html',
  styleUrls: ['./expo-hall.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExpoHallPage implements OnInit {
  sponsors: any;
  private iterableDiffer;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {
  }

  reloadSponsors() {
    this.loadingCtrl.create({
      message: 'Fetching latest...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.confData.getSponsors().subscribe((sponsors: any[]) => {
        this.sponsors = sponsors;
        for (const [level, sponsorss] of Object.entries(this.sponsors)) {
          for(const [index, sponsor] of Object.entries(sponsorss)) {
            if (sponsor.booth_number !== null) {
                console.log(sponsor);
                let elem = document.getElementById("booth"+sponsor.booth_number);
                elem.innerHTML = "<img class=\"booth-img\" src=\"" + sponsor.logo_url+ "\">";
            }
          }
        }
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  ngOnInit() {
    this.reloadSponsors();
  }

  ngAfterViewChecked() {
    document.getElementById("mapContainer").scrollLeft = 200;
  }

}
