import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Config, Platform } from '@ionic/angular';
import { BarcodeScanner, BarcodeFormat, LensFacing, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { Storage } from '@ionic/storage-angular';

import { PyConAPI } from '../../providers/pycon-api';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-door-check',
  templateUrl: './door-check.page.html',
  styleUrls: ['./door-check.page.scss'],
})
export class DoorCheckPage implements OnInit, OnDestroy {
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

  mode: string|null = "door_check";
  category: number|null = null;
  product: any = null;

  redeemable_products: any = null;
  redeemable_categories: any = null;
  display_products: any = null;

  product_attendees: Map<string, number>|null = null;

  constructor(
    public platform: Platform,
    private config: Config,
    private pycon: PyConAPI,
    private storage: Storage,
    public detectorRef: ChangeDetectorRef,
  ) { }

  filterProducts() {
    if (this.category) {
      return this.redeemable_products.filter(product => product.category === this.category);
    }
    return this.redeemable_products
  }

  getProductName(productId: number) {
    return this.redeemable_products.find(x => x.id === productId)?.name
  }

  getCategoryName(categoryId: number) {
    return this.redeemable_categories.find(x => x.id === categoryId)?.name
  }

  refreshProducts() {
    this.display_products = this.filterProducts().sort(function(a, b){if (a.name < b.name) return -1; if (a.name < b.name) return 1; return 0;});
    this.detectorRef.detectChanges();
  }

  updateLastScan = async (accessCode: string) => {
    this.last_scan = {
      "status": this.product_attendees.has(accessCode) ? this.product_attendees[accessCode] : this.product_attendees[accessCode],
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

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  handleScan = async (result: any) => {
    if (result.barcodes && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      this.updateLastScan(result.barcodes[0].rawValue.split(':')[0]);
    }
  }

  startScan = async () => {
    this.product_attendees = new Map(); 
    if (this.product === "all") {
      this.display_products.forEach((prod) => {
        this.pycon.fetchAttendeesByProductWithQuantity(prod.id).then((data) => {
          data.subscribe(attendees => {
            attendees.forEach((attendee) => {
              if (this.product_attendees.has(attendee.id)) {
                this.product_attendees[attendee.id] += attendee.quantity;
              } else {
                this.product_attendees[attendee.id] = attendee.quantity;
              }
            });
          })
        })
      })
    } else {
      if (this.product) {
        await this.pycon.fetchAttendeesByProductWithQuantity(this.product).then((data) => {
          data.subscribe(attendees => {
            console.log(attendees);
            attendees.forEach((attendee) => {
              if (this.product_attendees.has(attendee.id)) {
                this.product_attendees[attendee.id] += attendee.quantity;
              } else {
                this.product_attendees[attendee.id] = attendee.quantity;
              }
            });
          })
        })
      }
    }
    const permission = await this.checkPermission();
    if (!permission) {
      this.show_permissions_error = true;
      return;
    }
    this.show_permissions_error = false;
    this.content_visibility = 'hidden';
    this.scan_start_button_visibility = 'hidden';
    this.scan_stop_button_visibility = '';
    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async result => {
        this.handleScan(result)
      },
    );
    BarcodeScanner.startScan({
      formats: [BarcodeFormat.QrCode],
      lensFacing: LensFacing.Back
    });
  };

  stopScan = async () => {
    this.last_scan = null;
    clearTimeout(this.scan_timeout);
    await BarcodeScanner.removeAllListeners();
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
