import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config, InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage implements OnInit {
  // Get a reference to the search bar
  @ViewChild('search') search : any;
  speakers: any[] = [];
  displaySpeakers: any[] = [];
  speakerQueryText = '';
  ios: boolean;
  showSearchbar: boolean;
  page: number = 0;
  scrolling: boolean = false;

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
    this.scrolling = false;
    this.displaySpeakers = [];
    this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
      this.displaySpeakers = speakers;
    });
  }

  resetSpeakers() {
    this.page = 0;
    this.speakerQueryText = "";
    this.speakers = [];
    this.displaySpeakers = [];
    this.reloadSpeakers();
  }

  async generateSpeakers() {
    if (this.page >= 0) {
      this.speakers.slice(25*this.page, 25*this.page + 25).forEach(speaker => this.displaySpeakers.push(speaker));
      console.log(this.speakers.length, this.displaySpeakers.length)
      if (this.speakers.length == this.displaySpeakers.length) {
        this.page = -1
        this.scrolling = false;
      } else {
        this.page += 1;
        this.scrolling = true;
        this.changeDetection.detectChanges();
      }
    }
  }

  onIonInfinite(ev) {
    this.generateSpeakers().then(() => {
      setTimeout(() => {(ev as InfiniteScrollCustomEvent).target.complete()}, 200);
    });
  }

  reloadSpeakers() {
    this.scrolling = false;
    console.log('fetching speakers');
    this.loadingCtrl.create({
      message: 'Fetching latest speakers...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.displaySpeakers = [];
      this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
        this.speakers = speakers;
        this.generateSpeakers();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  async focusButton() {
     setTimeout(() => {
       this.search.setFocus();
     }, 500); // ms delay
   }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.reloadSpeakers();
  }

  ionViewDidEnter() {
  }
}
