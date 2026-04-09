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
  allSprints: any[] = [];
  sprints: any[] = [];
  searchText: string = '';
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
        this.allSprints = sprints;
        this.filterSprints();
        this.changeDetection.detectChanges();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
    this.userData.isLoggedIn().then((resp) => {
      this.loggedIn = resp;
    });
  }

  filterSprints() {
    if (!this.searchText.trim()) {
      this.sprints = this.allSprints;
      return;
    }
    const words = this.searchText.toLowerCase().replace(/,|\.|-/g, ' ').split(' ').filter(w => w.trim().length);
    this.sprints = this.allSprints.filter(sprint => {
      const haystack = `${sprint.name} ${sprint.submitter || ''} ${sprint.description_html || ''}`.toLowerCase();
      return words.every(word => haystack.includes(word));
    });
  }

  resetSearch() {
    this.searchText = '';
    this.sprints = this.allSprints;
  }

  submitSprint() {
    window.open(`${environment.baseUrl}/2026/sprints/project/submit/`, '_system', 'location=yes');
  }

  ngOnInit() {
    this.reloadContent();
    window.addEventListener('user:login', () => {
      this.loggedIn = true;
      this.changeDetection.detectChanges();
    });
    window.addEventListener('user:logout', () => {
      this.loggedIn = false;
      this.changeDetection.detectChanges();
    });
  }
}
