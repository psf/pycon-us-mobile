import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Config, Platform } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage';

import { PyConAPI } from '../../providers/pycon-api';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-door-check',
  templateUrl: './door-check.page.html',
  styleUrls: ['./door-check.page.scss'],
})
export class DoorCheckPage implements OnInit {
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
  product: number|null = null;

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
  ) { }

  filterProducts() {
    if (this.category) {
      return this.redeemable_products.filter(product => product.category === this.category);
    }
    return this.redeemable_products
  }

  getProductName(productId: number) {
    return this.redeemable_products.find(x => x.id === productId).name
  }

  getCategoryName(categoryId: number) {
    return this.redeemable_categories.find(x => x.id === categoryId).name
  }

  refreshProducts() {
    this.display_products = this.filterProducts();
    this.detectorRef.detectChanges();
  }

  refresh_presentation = async () => {
    var allScans = [];
    this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-scan-")) {
        allScans.push({
          "status": "pending",
          "scanned_at": value.scannedAt,
          "access_code": value.scanData.split(":")[0],
          "note": value.note,
        })
      } else if (key.startsWith("synced-scan-")) {
        allScans.push({
          "status": "captured",
          "scanned_at": value.scannedAt,
          "access_code": value.scanData.split(":")[0],
          "first_name": value.data.first_name,
          "note": value.note,
        })
      }
    });
    this.scan_presentation = allScans;
  }

  updateLastScan = async (accessCode: string) => {
    this.last_scan = {
      "status": this.product_attendees.includes(accessCode)
    };
    this.detectorRef.detectChanges();
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

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  handleScan = async (result: ScanResult) => {
    if (result.hasContent && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      this.updateLastScan(result.content.split(':')[0]);
    }
  }

  startScan = async () => {
    console.log(this.product);
    if (this.product) {
      await this.pycon.fetchAttendeesByProduct(this.product).then((data) => {
        data.subscribe(attendees => {
          console.log(attendees);
          this.product_attendees = attendees;
        })
      })
    }
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
  };

  stopScan = async () => {
    this.last_scan = null;
    clearTimeout(this.scan_timeout);
    await BarcodeScanner.stopScan()
    this.refresh_presentation();
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
    this.refresh_presentation();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
