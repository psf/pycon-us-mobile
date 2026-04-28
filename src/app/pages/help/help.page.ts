import { Component, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';

import { FloorPlanModalComponent } from '../../floor-plan-modal/floor-plan-modal.component';
import { VENUE_LOCATIONS, VenueLocation } from '../../location-map/venue-locations';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  infoDesk: VenueLocation = VENUE_LOCATIONS['infoDesk'];

  constructor(private modalCtrl: ModalController) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }

  async openInfoDesk() {
    const modal = await this.modalCtrl.create({
      component: FloorPlanModalComponent,
      componentProps: {
        title: this.infoDesk.floorTitle,
        imageSrc: this.infoDesk.fullSrc,
        altText: `${this.infoDesk.floorTitle} floor plan with Information Desk highlighted`,
        pinXPct: this.infoDesk.pinXPct,
        pinYPct: this.infoDesk.pinYPct,
        pinLabel: this.infoDesk.label,
      },
    });
    await modal.present();
  }
}
