import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config, InfiniteScrollCustomEvent } from '@ionic/angular';

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
  ) {}

  updateSpeakers() {
    this.confData.getSpeakers("").subscribe((speakers: any[]) => {
      this.speakers = speakers;
      this.generateSpeakers();
    });
  }

  searchSpeakers() {
    this.displaySpeakers = [];
    this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
      this.displaySpeakers = speakers;
    });
  }

  resetSpeakers() {
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

  handleRefresh(event) {
    this.updateSpeakers();
    setTimeout(() => {
      event.target.complete();
    }, 250);
  }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
  }

  ionViewDidEnter() {
    this.updateSpeakers();
  }
}
