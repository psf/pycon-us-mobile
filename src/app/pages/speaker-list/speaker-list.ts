import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Config } from '@ionic/angular';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  speakerQueryText = '';
  ios: boolean;
  showSearchbar: boolean;

  constructor(
    public confData: ConferenceData,
    public config: Config,
  ) {}

  updateSpeakers() {
    console.log(this.speakerQueryText);
    this.confData.getSpeakers(this.speakerQueryText).subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }

  handleRefresh(event) {
    this.updateSpeakers();
    setTimeout(() => {
      event.target.complete();
    }, 250);
  }

  ionViewDidEnter() {
    this.ios = this.config.get('mode') === 'ios';
    this.updateSpeakers();
  }
}
