import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config, InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage implements OnInit {
  speakers: any[] = [];
  displaySpeakers: any[] = [];
  speakerQueryText = '';
  ios: boolean;
  showSearchbar: boolean;
  page: number = 0;

  constructor(
    public confData: ConferenceData,
    public config: Config,
    private changeDetection: ChangeDetectorRef,
    private loadingCtrl: LoadingController,

  ) {}

  updateSpeakers() {
    this.confData.getSpeakers("").subscribe((speakers: any[]) => {
      this.speakers = speakers;
      this.generateSpeakers();
    });
  }

  searchSpeakers() {
    this.showSearchSpinner = true;
    this.displaySpeakers = [];
    this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
      this.displaySpeakers = speakers;
      this.showSearchSpinner = false;
    });
  }

  resetSpeakers() {
    this.page = 0;
    this.displaySpeakers = [];
    this.changeDetection.detectChanges();
    this.updateSpeakers();
  }

  async generateSpeakers() {
    if (this.page >= 0) {
      this.speakers.slice(25*this.page, 25*this.page + 25).forEach(speaker => this.displaySpeakers.push(speaker));
      console.log(this.speakers.length, this.displaySpeakers.length)
      if (this.speakers.length == this.displaySpeakers.length) {
        this.page = -1
      } else {
        this.page += 1;
        this.changeDetection.detectChanges();
      }
    }
  }

  onIonInfinite(ev) {
    this.generateSpeakers();
    (ev as InfiniteScrollCustomEvent).target.complete();
  }

  reloadSpeakers() {
    console.log('fetching speakers');
    this.loadingCtrl.create({
      message: 'Fetching latest speakers...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.displaySpeakers = [];
      this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
        this.updateSpeakers();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.reloadSpeakers();
  }

  ionViewDidEnter() {
  }
}
