import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import {loadStripeTerminal} from '@stripe/terminal-js';

import { PyConAPI } from '../../providers/pycon-api';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {
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

  terminal: any = null;

  attendee: any = null;
  products: any = null;
  inventory: any = null;
  cart: any = [];

  constructor(
    private pycon: PyConAPI,
    public detectorRef: ChangeDetectorRef,
  ) { }

  clearCart() {this.cart = []};

  addToCart(productId) {
    console.log(this.inventory);
    console.log(this.products);
    const elem = <HTMLInputElement>document.getElementById("product-" + productId + "-price")
    const price = elem.value
    const product = this.products[productId];
    elem.value = product.product_price;
    this.cart.push({product_name: product.product_name, product_id: productId, quantity: 1, price: price})
    
  }

  async fetchConnectionToken() {
    const data = await this.pycon.fetchConnectionToken()
    console.log(data);
    return data.secret;
  }

  async unexpectedDisconnect() {};

  async discoverReaderHandler() {
      var config = {
          simulated: false
      };
      this.terminal.discoverReaders(config).then(function(discoverResult) {
          if (discoverResult.error) {
              console.log(`Failed to discover: ${discoverResult.error}`, 'danger');
          } else if (discoverResult.discoveredReaders.length === 0) {
              console.log('No available readers.', 'warning');
          } else {
              const discoveredReaders = discoverResult.discoveredReaders;
              console.log('Readers found.', 'success');
              discoveredReaders.forEach(reader => {
                console.log(reader);
              //    var a = document.createElement('li');
              //    a.className = "list-group-item list-group-item-action"
              //    a.id = "reader-" + reader.label;
              //    a.onclick = function() {
              //        connectReaderHandler(reader)
              //    };
              //    if (reader.status === "online") {
              //        var glyph = '<span class="badge badge-pill badge-success">online</span>';
              //    } else {
              //        a.disabled = true;
              //        a.onclick = null;
              //        var glyph = '<span class="badge badge-pill badge-dark">offline</span>';
              //    }
              //    a.innerHTML = reader.label + ' ' + glyph;
              //    readerList.appendChild(a);
              });
          }
      });
  }

  ngOnInit() {
    loadStripeTerminal().then((stripeTerminal) => {
      this.terminal = stripeTerminal.create({
        onFetchConnectionToken: this.fetchConnectionToken,
        onUnexpectedReaderDisconnect: this.unexpectedDisconnect,
      })
      this.discoverReaderHandler();
    })
    
    this.pycon.fetchInventory(null, null).then((data) => {
      data.subscribe(inventory => {
        this.inventory = inventory;
        var newProducts = new Object; 
        for (const [key, value] of Object.entries(this.inventory)) {
          console.log(key);
          (value as Array<any>).forEach(function (item) {
            newProducts[item.product_id] = item;
          })
        }
        this.products = newProducts;
      })
    })
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  updateLastScan = async (accessCode: string) => {
    this.last_scan = {
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

  reset = async () => {
    this.attendee = null;
    this.cart = null;
    this.detectorRef.detectChanges();
  }

  clearLastScan = async () => {
    this.last_scan = null;
    this.detectorRef.detectChanges();
  }

  handleScan = async (result: ScanResult) => {
    if (result.hasContent && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      await this.pycon.fetchAttendeeData(result.content.split(':')[0]).then((data) => {
        data.subscribe(attendeeData => {
          this.attendee = attendeeData
          this.content_visibility = '';
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
    await this.reset();
    clearTimeout(this.scan_timeout);
    await BarcodeScanner.stopScan()
    this.scan_stop_button_visibility = 'hidden';
    this.scan_start_button_visibility = '';
    this.content_visibility = '';
  }

  ionViewWillLeave() {
    this.stopScan();
  }

}
