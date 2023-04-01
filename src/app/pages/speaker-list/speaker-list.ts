import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config } from '@ionic/angular';

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
    this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
      this.speakers = speakers;
      this.generateSpeakers();
    });
  }

  private generateSpeakers() {
    if (this.page >= 0) {
      console.log(this.speakers);
      console.log(this.page, 25*this.page, 25*this.page + 24);
      this.speakers.slice(25*this.page, 25*this.page + 24).forEach(speaker => this.displaySpeakers.push(speaker));
      if (this.speakers.length == this.displaySpeakers.length) {
        this.page = -1
      } else {
        this.page += 1;
      }
      this.changeDetection.detectChanges();
    }
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
