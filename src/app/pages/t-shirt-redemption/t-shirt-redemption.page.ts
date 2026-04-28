import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Config, Platform } from '@ionic/angular';
import { BarcodeScanner, BarcodeFormat, LensFacing, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { Storage } from '@ionic/storage-angular';
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
  scanning: boolean = false;
  scan_presentation = [];
  dirty: boolean = false;

  last_scan: any = null;
  last_scan_timeout: ReturnType<typeof setTimeout> = null;
  scanError: boolean = false;
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

  hasSelectedCategories(): boolean {
    return Array.isArray(this.category) && this.category.length > 0;
  }

  isCategorySelected(id: number): boolean {
    return Array.isArray(this.category) && this.category.includes(id);
  }

  toggleCategory(id: number) {
    if (!Array.isArray(this.category)) {
      this.category = [];
    }
    const idx = this.category.indexOf(id);
    if (idx > -1) {
      this.category.splice(idx, 1);
    } else {
      this.category.push(id);
    }
    if (this.category.length === 0) {
      this.category = null;
    }
    this.detectorRef.detectChanges();
  }

  selectedCategoryNames(): string {
    if (!this.hasSelectedCategories()) return '';
    return this.category!.map(id => this.getCategoryName(id)).filter(Boolean).join(', ');
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
      const status = await BarcodeScanner.checkPermissions();
      if (status) {
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

  clearError = async () => {
    this.scanError = false;
    this.detectorRef.detectChanges();
  }

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  addListeners = async () => {
    console.log(this.scanError);
    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async result => {
        this.handleScan(result)
      },
    );
  }

  removeListeners = async () => {
    await BarcodeScanner.removeAllListeners();
  }

  handleScan = async (result: any) => {  // Should be type ScanResult or BarcodeScannedEvent???
    if (result.barcodes && !this.ignore_scans) {
      await this.removeListeners();
      clearTimeout(this.last_scan_timeout);
      await this.pycon.fetchAttendeeProducts(
        result.barcodes[0].rawValue.split(':')[0], this.category, this.mode
      ).then((data) => {
        data.subscribe(
          redemptionData => {
            if (redemptionData) {
              console.log(redemptionData);
              this.openRedemptionModal(redemptionData)
            }
          },
          error => {
            this.scanError = true;
            this.detectorRef.detectChanges();
          }
        )
      }
      ).then(
        () => {setTimeout(this.addListeners, 250); setTimeout(this.clearError, 1000);}
      );
    }
  }

  startScan = async () => {
    const permission = await this.checkPermission();
    if (!permission) {
      this.show_permissions_error = true;
      return;
    }
    this.show_permissions_error = false;
    this.scanning = true;
    await this.addListeners();
    BarcodeScanner.startScan({
      formats: [BarcodeFormat.QrCode],
      lensFacing: LensFacing.Back
    });
  }

  stopScan = async () => {
    this.last_scan = null;
    clearTimeout(this.scan_timeout);
    await this.removeListeners();
    await BarcodeScanner.stopScan()
    this.scanning = false;
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  ngOnInit(): void {
    this.ios = this.config.get('mode') === `ios`;
    this.pycon.fetchCheckInProducts().then((data) => {
      data.subscribe(redeemable => {
        // /check_in/redeemable/ returns the union of every redeemable
        // category (sessions + swag) and CategorySerializer omits
        // render_type, so we have to discriminate by name. Swag pickup
        // only redeems merch — keep T-Shirt categories (and any
        // future "swag-*" naming) and drop the rest. Long-term fix:
        // expose render_type on the API.
        const categories = (redeemable?.redeemable_categories ?? [])
          .filter(c => /shirt|swag/i.test(c?.name ?? ''));
        const keepIds = new Set(categories.map(c => c.id));
        this.redeemable_categories = categories;
        this.redeemable_products = (redeemable?.redeemable_products ?? [])
          .filter(p => keepIds.has(p.category));
      })
    })
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
