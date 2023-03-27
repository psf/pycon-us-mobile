import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  speakerQueryText = '';

  constructor(public confData: ConferenceData) {}

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
    this.updateSpeakers();
  }
}
