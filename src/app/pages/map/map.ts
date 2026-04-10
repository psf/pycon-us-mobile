import { Component, ElementRef, ChangeDetectorRef, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { AlertController, Config, Platform } from '@ionic/angular';
import { StartScanOptions, BarcodeScanner, BarcodeFormat, LensFacing, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';

import { PyConAPI } from '../../providers/pycon-api';
import { UserData } from '../../providers/user-data';
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
  ignore_scans: boolean = false;

  ios: boolean;
  show_permissions_error: boolean = false;
  isStaffScanner: boolean = false;
  selectedSponsor: any = null;
  sponsorList: any[] = [];

  constructor(
    public confData: ConferenceData,
    public platform: Platform,
    private config: Config,
    private pycon: PyConAPI,
    private userData: UserData,
    private storage: Storage,
    private alertCtrl: AlertController,
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
      } else if (key.startsWith("failed-scan-")) {
        allScans.push({
          "status": "failed",
          "scanned_at": value.scannedAt,
          "access_code": value.scanData.split(":")[0],
          "note": value.note,
        })
      }
    });
    this.scan_presentation = allScans;
  }

  openNoteModal = async (accessCode, scan) => {
    clearTimeout(this.scan_timeout);
    this.ignore_scans = true;
    const note = await this.pycon.getNote(accessCode);
    const modal = await this.modalCtrl.create({
      component: LeadNoteModalComponent,
      componentProps: {
        'scan': scan,
        'note': (note)? note.note : null,
      }
    })
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    this.ignore_scans = false;
    if (role === 'save' && data.note) {
      this.pycon.storeNote(accessCode, data.note).then(() => {
        this.refresh_presentation();
      });
    }
  }

  syncAllPending = async () => {
    await this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-scan-")) {
        this.pycon.syncScan(value.scanData.split(':')[0]).then((resp) => {console.log(resp)});
      }
    });
    await this.storage.forEach((value, key, index) => {
      if (key.startsWith("pending-note-")) {
        this.pycon.syncNote(value.accessCode).then((resp) => {console.log(resp)});
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

  handleScan = async (result: any) => {  // should be ScanResult or BarcodeScannedEvent
    const firstBarcode = result.barcodes[0];
    if (!firstBarcode) {
      return;
    }
    BarcodeScanner.removeAllListeners();
    if (result.barcodes && !this.ignore_scans) {
      clearTimeout(this.last_scan_timeout);
      this.updateLastScan(firstBarcode.rawValue.split(':')[0], 0);
      this.pycon.storeScan(firstBarcode.rawValue.split(':')[0], firstBarcode.rawValue).then(() => {
        console.log(firstBarcode.rawValue); // log the raw scanned content
      });
    }
    setTimeout(this.setupListeners, 500);
  }

  setupListeners = async () => {
    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async result => {
        this.handleScan(result)
      },
    );
  }

  startScan = async () => {
    const permission = await this.checkPermission();
    if (!permission) {
      this.show_permissions_error = true;
      return;
    }

    this.show_permissions_error = false;
    this.content_visibility = 'hidden';
    this.scan_start_button_visibility = 'hidden';
    this.scan_stop_button_visibility = '';

    const options: StartScanOptions = {
      formats: [BarcodeFormat.QrCode],
      lensFacing: LensFacing.Back,
    }
    await this.setupListeners();
    await BarcodeScanner.startScan(options);
  };

  stopScan = async () => {
    this.last_scan = null;
    clearTimeout(this.scan_timeout);
    await BarcodeScanner.removeAllListeners();
    await BarcodeScanner.stopScan()
    this.refresh_presentation();
    this.scan_stop_button_visibility = 'hidden';
    this.scan_start_button_visibility = '';
    this.content_visibility = '';
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  async ngOnInit() {
    BarcodeScanner.removeAllListeners();
    this.ios = this.config.get('mode') === `ios`;
    this.refresh_presentation();
    setTimeout(this.syncAllPending, 60000);

    // Show consent dialog on first use
    await this.showConsentDialog();

    // Check if this is a staff user (has door_check but not lead_retrieval)
    const hasLeadRetrieval = await this.userData.checkHasLeadRetrieval();
    const hasDoorCheck = await this.userData.checkHasDoorCheck();
    if (!hasLeadRetrieval && hasDoorCheck) {
      this.isStaffScanner = true;
      this.showSponsorSelector();
    }
  }

  async showConsentDialog() {
    const hasConsent = await this.userData.checkScannerConsent();
    if (hasConsent) return;

    const alert = await this.alertCtrl.create({
      header: 'Lead Scanner Consent',
      message: 'By using the lead scanner, you confirm that you will only scan badges of attendees who have given you explicit verbal permission. Scanning without consent violates the PyCon US Code of Conduct.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Disable scanning — user didn't consent
            this.scan_start_button_visibility = 'hidden';
          },
        },
        {
          text: 'I Agree',
          handler: () => {
            this.userData.setScannerConsent(true);
          },
        },
      ],
    });
    await alert.present();
    // Wait for dismissal before continuing
    await alert.onDidDismiss();
  }

  async showSponsorSelector() {
    try {
      const result: any = await this.pycon.fetchLeadRetrievalSponsors();
      this.sponsorList = result.sponsors || [];
    } catch (e) {
      console.log('Failed to fetch sponsors for staff scanner', e);
      const errorAlert = await this.alertCtrl.create({
        header: 'Unable to load sponsors',
        message: 'Could not fetch the sponsor list. Check your network connection or try again later.',
        buttons: ['OK'],
      });
      await errorAlert.present();
      return;
    }

    if (this.sponsorList.length === 0) {
      const emptyAlert = await this.alertCtrl.create({
        header: 'No sponsors available',
        message: 'No sponsors with lead retrieval are configured yet.',
        buttons: ['OK'],
      });
      await emptyAlert.present();
      return;
    }

    const inputs = this.sponsorList.map(s => ({
      type: 'radio' as const,
      label: s.name + (s.booth_number ? ` (Booth ${s.booth_number})` : ''),
      value: String(s.id),
    }));

    const alert = await this.alertCtrl.create({
      header: 'Scan on behalf of',
      message: 'Select which sponsor you are scanning for:',
      inputs,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Select',
          handler: (sponsorId) => {
            if (sponsorId) {
              this.selectedSponsor = this.sponsorList.find(s => String(s.id) === sponsorId);
              this.pycon.setStaffSponsorId(sponsorId);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
