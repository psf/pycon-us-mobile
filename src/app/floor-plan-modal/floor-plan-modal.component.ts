import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-floor-plan-modal',
  templateUrl: './floor-plan-modal.component.html',
  styleUrls: ['./floor-plan-modal.component.scss'],
})
export class FloorPlanModalComponent {
  @Input() title!: string;
  @Input() imageSrc!: string;
  @Input() altText?: string;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
