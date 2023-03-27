import { Component, ElementRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';

import { PyConAPI } from '../../providers/pycon-api';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements OnDestroy {

  content_visibility = 'show';
  scan_stop_button_visibility = 'hidden';

  constructor(
    public confData: ConferenceData,
    public platform: Platform,
    private pycon: PyConAPI,
    private toastController: ToastController) {}

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
      const toast = await this.toastController.create({
        message: 'Scan Successful for ' + result.content,
        duration: 900,
        position: 'top',
        icon: 'checkmark-circle-outline'
      });
      toast.present();
      this.pycon.storeScan(result.content.split(':')[0], result.content);
      console.log(result.content); // log the raw scanned content
      setTimeout(BarcodeScanner.resumeScanning, 1000);
    }
  }

  startScan = async () => {
    const permission = await this.checkPermission();
    if (!permission) {
      return;
    }
    BarcodeScanner.hideBackground();
    this.content_visibility = 'hidden';
    this.scan_stop_button_visibility = '';
    BarcodeScanner.startScanning({
      targetedFormats: [SupportedFormat.QR_CODE],
      cameraDirection: 'back'
    }, this.handleScan);
  };

  stopScan = async () => {
    await BarcodeScanner.stopScan()
    this.scan_stop_button_visibility = 'hidden';
    this.content_visibility = '';
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
