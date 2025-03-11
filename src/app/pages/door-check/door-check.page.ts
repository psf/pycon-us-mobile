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
  scanningProducts: [any] = null;

  redeemable_products: any = null;
  redeemable_categories: any = null;
  display_products: any = null;

  product_attendees: Map<string, number>|null = null;
  inventory: Map<string, Map<number, number>>|null = null;

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

  syncAllPending = async () => {
    await this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-door-check-")) {
        this.syncScan(key.split('pending-door-check-')[1]).then((resp) => {console.log(resp)});
      }
    });
    setTimeout(this.syncAllPending, 60000);
  }

  async syncScan(accessCode: string) {
    const pending = await this.storage.get('pending-door-check-' + accessCode).then((value) => {
      return value
    });
    const synced = await this.storage.get('synced-door-check-' + accessCode).then((value) => {
      return value
    });

    if (pending === null) {
      console.log('Unable to sync missing ' + accessCode);
    }

    const scanData = pending.scanData;
    const _accessCode = scanData.scannedCode.split(":")[0];
    const _validator = scanData.scannedCode.split(":")[1];

    var payload = {attendee_access_code: _accessCode, badge_validator: _validator, scanned_at: pending.scannedAt}
    for (const [key, value] of scanData.productQuantities) {
      payload["product-redeem-" + key] = key
      payload["product-" + key + "-quantity"] = value
    }


    await this.pycon.redeemProducts(payload).then((data) => {
      data.subscribe(redemptionData => {
        this.storage.set('synced-door-check-' + accessCode, {...redemptionData, ...pending}).then((value) => {
          this.storage.remove('pending-door-check-' + accessCode);

        });
      })
    })
  }

  async storeScan(accessCode: string, access: boolean, productQuantities: Map<string, number>, scannedCode: string) {
    if (this.last_scan !== null && this.last_scan.code == accessCode) {
      return
    }
    const pending = await this.storage.get('pending-door-check-' + accessCode).then((value) => {
      return value
    });
    const synced = await this.storage.get('synced-door-check-' + accessCode).then((value) => {
      return value
    });
    if (pending != null) {
      this.syncScan(accessCode);
      return;
    } else {
      const scanDate = new Date();
      return this.storage.set(
        'pending-door-check-' + accessCode,
        {scanData: {productQuantities: productQuantities, scannedCode: scannedCode}, scannedAt: scanDate.toISOString()}
      ).then(() => {
        console.log('Scanned ' + accessCode);
        this.syncScan(accessCode);
      }).catch((error) => {
        console.log('SCAN FAILED ' + accessCode);
      });
    }
  }

  displayLastScan(accessCode: string, access: boolean, quantity: number, productQuantities: Map<string, number>, scannedCode: string) {
    if (access && quantity > 0) {
      this.storeScan(accessCode, access, productQuantities, scannedCode);
    }
    this.last_scan = {
      "status": access ? quantity : quantity,
      "code": accessCode
    };
    this.detectorRef.detectChanges();
    this.last_scan_timeout = setTimeout(this.clearLastScan, 5000);
  }

  updateLastScan = async (scannedCode: string) => {
    let access: boolean = false;
    let quantity: number = 0;
    let productQuantities: Map<string, number>  = new Map();

    let accessCode = scannedCode.split(':')[0];

    this.scanningProducts.forEach((productId) => {
      if (this.inventory.get(accessCode)?.get(productId) > 0) {
        access = true;
        quantity += this.inventory.get(accessCode).get(productId);
        productQuantities.set(productId, this.inventory.get(accessCode).get(productId));
      }
    })

    if (access) {
      this.displayLastScan(accessCode, access, quantity, productQuantities, scannedCode);
    } else {
      await this.pycon.fetchAttendeeProductsForProducts(accessCode, this.scanningProducts, "door_check_mode").then((data) => {
        data.subscribe(
          attendeeData => {
            var attendeeDataAny = attendeeData as any;
            if (attendeeDataAny?.has_items_to_redeem) {
              access = true;
              for (var category in attendeeDataAny.redeemable_products_by_category) {
                attendeeDataAny.redeemable_products_by_category[category].forEach((product) => {
                  quantity += product.redeemable;
                  productQuantities.set(product, product.redeemable);
                })
              }
            }
            this.displayLastScan(accessCode, access, quantity, productQuantities, scannedCode);
          },
          error => {
            this.displayLastScan(accessCode, access, quantity, productQuantities, scannedCode);
          }
        )
      });
    }
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

  addListeners = async () => {
    console.log('restarting scanner');
    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async result => {
        this.handleScan(result)
      },
    );
  }

  removeListeners = async () => {
    console.log('pausing scanner');
    await BarcodeScanner.removeAllListeners();
  }

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  handleScan = async (result: any) => {
    console.log('scanned!');
    await this.removeListeners();
    if (result.barcodes && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      this.updateLastScan(result.barcodes[0].rawValue);
      setTimeout(this.addListeners, 250);
    }
  }

  startScan = async () => {
    if (this.product === "all") {
        this.scanningProducts = this.display_products.map((product) => {return product.id});
    } else {
        this.scanningProducts = [this.product];
    }

    this.product_attendees = new Map();
    this.inventory = new Map();

    this.scanningProducts.forEach((productId) => {
      this.pycon.fetchAttendeesByProductWithQuantity(productId).then((data) => {
        data.subscribe(attendees => {
          attendees.forEach((attendee) => {
            if (this.product_attendees.has(attendee.id)) {
              this.product_attendees.set(attendee.id, this.product_attendees.get(attendee.id) + attendee.quantity);
            } else {
              this.product_attendees.set(attendee.id, attendee.quantity);
            }

            if (this.inventory.has(attendee.id)) {
              if (this.inventory.get(attendee.id).has(productId)) {
                this.inventory.get(attendee.id).set(productId, this.inventory.get(attendee.id).get(productId) + attendee.quantity);
              } else {
                this.inventory.get(attendee.id).set(productId, attendee.quantity);
              }
            } else {
              this.inventory.set(attendee.id, new Map());
              this.inventory.get(attendee.id).set(productId, attendee.quantity);
            }
          });
        })
      })
    })

    const permission = await this.checkPermission();
    if (!permission) {
      this.show_permissions_error = true;
      return;
    }
    this.show_permissions_error = false;
    this.content_visibility = 'hidden';
    this.scan_start_button_visibility = 'hidden';
    this.scan_stop_button_visibility = '';
    await this.addListeners();
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
    this.syncAllPending();
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
