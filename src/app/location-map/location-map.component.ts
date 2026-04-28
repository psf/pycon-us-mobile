import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FloorPlanModalComponent } from '../floor-plan-modal/floor-plan-modal.component';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss'],
})
export class LocationMapComponent {
  @Input() label!: string;
  @Input() sublabel?: string;
  @Input() floorTitle!: string;
  @Input() thumbSrc!: string;
  @Input() fullSrc!: string;
  @Input() pinXPct!: number;
  @Input() pinYPct!: number;

  constructor(private modalCtrl: ModalController) {}

  async openFull() {
    const modal = await this.modalCtrl.create({
      component: FloorPlanModalComponent,
      componentProps: {
        title: this.floorTitle,
        imageSrc: this.fullSrc,
        altText: `${this.floorTitle} floor plan with ${this.label} highlighted`,
        pinXPct: this.pinXPct,
        pinYPct: this.pinYPct,
        pinLabel: this.label,
      },
    });
    await modal.present();
  }
}
