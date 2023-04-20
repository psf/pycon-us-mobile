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

  last_scan: any = null;
  last_scan_timeout: ReturnType<typeof setTimeout> = null;
  scan_timeout: ReturnType<typeof setTimeout> = null;
  ignore_scans: boolean = false;

  ios: boolean;
  show_permissions_error: boolean = false;

  constructor(
    public platform: Platform,
    private config: Config,
    private pycon: PyConAPI,
    private storage: Storage,
    public detectorRef: ChangeDetectorRef,
  ) { }

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

  updateLastScan = async (accessCode: string, calNo: number) => {
    calNo += 1;
    this.pycon.fetchScan(accessCode).then((scan) => {
      if (scan) {
        this.last_scan = {
          "status": scan.data?.first_name? "captured": "pending",
          "scanned_at": scan.scannedAt,
          "access_code": scan.scanData.split(":")[0],
          "first_name": scan.data?.first_name? scan.data.first_name : null,
          "note": scan.note,
        };
        this.detectorRef.detectChanges();
        if (!scan.data?.first_name && calNo < 30) {
          setTimeout(() => {this.updateLastScan(accessCode, calNo);}, 100);
        } else {
          this.last_scan_timeout = setTimeout(this.clearLastScan, 5000);
        }
      } else {
        if (calNo < 30) {
          setTimeout(() => {this.updateLastScan(accessCode, calNo);}, 100);
        } else {
          this.last_scan_timeout = setTimeout(this.clearLastScan, 5000);
        }
      }
    });
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
      this.updateLastScan(result.content.split(':')[0], 0);
      this.pycon.storeScan(result.content.split(':')[0], result.content).then(() => {
        console.log(result.content); // log the raw scanned content
        clearTimeout(this.scan_timeout);
        this.scan_timeout = setTimeout(BarcodeScanner.resumeScanning, 1500);
      });
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
    this.refresh_presentation();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
