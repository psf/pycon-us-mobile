import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-redemption-modal',
  templateUrl: './redemption-modal.component.html',
  styleUrls: ['./redemption-modal.component.scss'],
})
export class RedemptionModalComponent {
  @Input() accessCode: string;
  @Input() attendeeName: string;
  @Input() attendeeId: string;
  @Input() hasItemsToRedeem: boolean;
  @Input() redeemableProductsByCategory: any;

  canRedeem: boolean = false;
  toRedeem: any = {};

  constructor(
    private modalCtrl: ModalController,
    public detectorRef: ChangeDetectorRef,
  ) { }

  checkProduct(event, productId, quantity) {
    if (event.detail.checked) {
      this.toRedeem[productId] = quantity;
    } else {
      delete this.toRedeem[productId];
    }
    this.canRedeem = (Object.keys(this.toRedeem).length > 0)
    this.detectorRef.detectChanges();
  }

  cancel() {
    return this.modalCtrl.dismiss({}, 'cancel');
  }

  confirm() {
    console.log(this.toRedeem)
    this.modalCtrl.dismiss({accessCode: this.accessCode, toRedeem: this.toRedeem}, 'save');
  }
}
