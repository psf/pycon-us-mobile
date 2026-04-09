import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { LiveUpdateService } from '../../providers/live-update.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.page.html',
  styleUrls: ['./sprints.page.scss'],
})
export class SprintsPage implements OnInit {
  sprints: any[] = [];
  loggedIn: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private confData: ConferenceData,
    private userData: UserData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  reloadContent() {
    this.loadingCtrl.create({
      message: 'Fetching latest...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.confData.getSprints().subscribe((sprints: any[]) => {
        this.sprints = sprints;
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
    this.userData.isLoggedIn().then((resp) => {
      this.loggedIn = resp;
    });
  }

  submitSprint() {
    window.open(`${environment.baseUrl}/2026/sprints/project/submit/`, '_system', 'location=yes');
  }

  ngOnInit() {
    this.reloadContent();
  }
}
