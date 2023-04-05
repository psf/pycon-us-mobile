import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config, Platform } from '@ionic/angular';
import { BarcodeScanner, SupportedFormat, CameraDirection, ScanResult } from '@capacitor-community/barcode-scanner';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';

import { PyConAPI } from '../../providers/pycon-api';
import { LiveUpdateService } from '../../providers/live-update.service';
import { LeadNoteModalComponent } from '../../lead-note-modal/lead-note-modal.component';


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

  last_scan: any = null;
  last_scan_timeout: ReturnType<typeof setTimeout> = null;
  scan_timeout: ReturnType<typeof setTimeout> = null;

  ios: boolean;
  show_permissions_error: boolean = false;

  constructor(
    public confData: ConferenceData,
    public platform: Platform,
    private config: Config,
    private pycon: PyConAPI,
    private storage: Storage,
    public modalCtrl: ModalController,
    public liveUpdateService: LiveUpdateService,
    public detectorRef: ChangeDetectorRef,
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

  openNoteModal = async (accessCode, scan) => {
    const note = await this.pycon.getNote(accessCode);
    console.log(note);
    const modal = await this.modalCtrl.create({
      component: LeadNoteModalComponent,
      componentProps: {
        'scan': scan,
        'note': note?.note,
      }
    })
    modal.present();
    this.stopScan();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data.note) {
      this.pycon.storeNote(accessCode, data.note).then(() => {
        this.refresh_presentation();
      });
    }
    this.startScan();
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
    }, 500);
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

  updateLastScan = async (accessCode: string) => {
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
        if (!scan.data?.first_name) {
          setTimeout(() => {this.updateLastScan(accessCode);}, 100);
        } else {
          this.last_scan_timeout = setTimeout(this.clearLastScan, 5000);
        }
      } else {
        setTimeout(() => {this.updateLastScan(accessCode);}, 100);
      }
    });
  }

  handleScan = async (result: ScanResult) => {
    if (result.hasContent) {
      clearTimeout(this.last_scan_timeout);
      this.updateLastScan(result.content.split(':')[0]);
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
    setTimeout(this.syncAllPending, 60000);
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
