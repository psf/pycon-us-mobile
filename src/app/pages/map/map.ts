import { Component, ElementRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

import { PyConAPI } from '../../providers/pycon-api';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnInit, OnDestroy {

  content_visibility = 'show';
  scan_start_button_visibility = 'show';
  scan_stop_button_visibility = 'hidden';
  scan_presentation = [];

  constructor(
    public confData: ConferenceData,
    public platform: Platform,
    private pycon: PyConAPI,
    private storage: Storage,
    private toastController: ToastController,
    public liveUpdateService: LiveUpdateService,
  ) {}

  sortScans() {
    return this.scan_presentation.sort(function(a, b) {
      var x = new Date(a.scanned_at);
      var y = new Date(b.scanned_at);
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }).slice(0, 50);
  }

  refresh_presentation = async () => {
    var allScans = [];
    this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-scan-")) {
        console.log(value);
        allScans.push({"status": "pending", "scanned_at": value.scannedAt, "access_code": value.scanData.split(":")[0]})
      } else if (key.startsWith("synced-scan-")) {
        allScans.push({"status": "captured", "scanned_at": value.scannedAt, "first_name": value.data.first_name})
      }
    });
    this.scan_presentation = allScans;
  }

  syncAllPending = async () => {
    this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-scan-")) {
        this.pycon.syncScan(value.scanData.split(':')[0]).then((resp) => {console.log(resp)});
      }
    });
    setTimeout(this.syncAllPending, 60000);
  }

  handleRefresh = (event) => {
    this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-scan-")) {
        this.pycon.syncScan(value.scanData.split(':')[0]).then((resp) => {console.log(resp)});
      }
    });
    setTimeout(() => {
      this.refresh_presentation();
      event.target.complete();
    }, 2000);
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

  handleScan = async (result: ScanResult) => {
    if (result.hasContent) {
      this.pycon.storeScan(result.content.split(':')[0], result.content).then(() => {
        console.log(result.content); // log the raw scanned content
        setTimeout(BarcodeScanner.resumeScanning, 1500);
      });
    }
  }

  startScan = async () => {
    const permission = await this.checkPermission();
    if (!permission) {
      return;
    }
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
    this.refresh_presentation();
    setTimeout(this.syncAllPending, 60000);
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
