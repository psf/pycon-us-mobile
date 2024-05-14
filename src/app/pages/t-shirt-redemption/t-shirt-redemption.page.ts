import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Config, Platform } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';

import { PyConAPI } from '../../providers/pycon-api';
import { LiveUpdateService } from '../../providers/live-update.service';
import { RedemptionModalComponent } from '../../redemption-modal/redemption-modal.component';


@Component({
  selector: 'app-t-shirt-redemption',
  templateUrl: './t-shirt-redemption.page.html',
  styleUrls: ['./t-shirt-redemption.page.scss'],
})
export class TShirtRedemptionPage implements OnInit, OnDestroy {
  content_visibility = 'show';
  scan_start_button_visibility = 'show';
  scan_stop_button_visibility = 'hidden';
  scan_presentation = [];
  dirty: boolean = false;

  last_scan: any = null;
  last_scan_timeout: ReturnType<typeof setTimeout> = null;
  scan_timeout: ReturnType<typeof setTimeout> = null;
  ignore_scans: boolean = false;

  ios: boolean;
  show_permissions_error: boolean = false;

  mode: string|null = "redemption_mode";
  category: Array<number>|null = null;

  redeemable_products: any = null;
  redeemable_categories: any = null;
  display_products: any = null;

  product_attendees: any = null;

  constructor(
    public platform: Platform,
    private config: Config,
    private pycon: PyConAPI,
    private storage: Storage,
    public detectorRef: ChangeDetectorRef,
    public modalCtrl: ModalController,
  ) { }

  getCategoryName(categoryId: number) {
    return this.redeemable_categories.find(x => x.id === categoryId)?.name
  }

  updateLastScan = async (accessCode: string) => {
    this.last_scan = {
      "status": this.product_attendees.includes(accessCode),
      "code": accessCode
    };
    this.detectorRef.detectChanges();
    this.last_scan_timeout = setTimeout(this.clearLastScan, 5000);
  }

  checkPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
    }
  }

  openRedemptionModal = async (redemptionData) => {
    clearTimeout(this.scan_timeout);
    this.ignore_scans = true;
    const modal = await this.modalCtrl.create({
      component: RedemptionModalComponent,
      componentProps: {
        accessCode: redemptionData.attendee_access_code,
        attendeeName: redemptionData.attendee_name,
        attendeeId: redemptionData.attendee_id,
        hasItemsToRedeem: redemptionData.has_items_to_redeem,
        redeemableProductsByCategory: redemptionData.redeemable_products_by_category,
      }
    })
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    this.ignore_scans = false;
    if (role === 'save' && data) {
      var payload = {attendee_access_code: data.accessCode}
      for (const [key, value] of Object.entries(data.toRedeem)) {
        payload["product-redeem-" + key] = key
        payload["product-" + key + "-quantity"] = value
      }
      console.log(payload);
      await this.pycon.redeemProducts(payload).then((data) => {
        data.subscribe(redemptionData => {
          console.log(redemptionData);
        })
      })
    }
  }

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  handleScan = async (result: ScanResult) => {
    if (result.hasContent && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      await this.pycon.fetchAttendeeProducts(result.content.split(':')[0], this.category, this.mode).then((data) => {
        data.subscribe(redemptionData => {
          console.log(redemptionData);
          this.openRedemptionModal(redemptionData)
        })
      })
    }
  }

  startScan = async () => {
    const permission = await this.checkPermission();
    if (!permission) {
      this.show_permissions_error = true;
      return;
    }
    this.show_permissions_error = false;
    BarcodeScanner.hideBackground();
    this.content_visibility = 'hidden';
    this.scan_start_button_visibility = 'hidden';
    this.scan_stop_button_visibility = '';
    BarcodeScanner.startScanning({
      targetedFormats: [SupportedFormat.QR_CODE],
      cameraDirection: 'back'
    }, this.handleScan);
  }

  stopScan = async () => {
    this.last_scan = null;
    clearTimeout(this.scan_timeout);
    await BarcodeScanner.stopScan()
    this.scan_stop_button_visibility = 'hidden';
    this.scan_start_button_visibility = '';
    this.content_visibility = '';
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  ngOnInit(): void {
    this.ios = this.config.get('mode') === `ios`;
    this.pycon.fetchCheckInProducts().then((data) => {
      data.subscribe(redeemable => {
        this.redeemable_products = redeemable?.redeemable_products;
        this.redeemable_categories = redeemable?.redeemable_categories;
      })
    })
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
