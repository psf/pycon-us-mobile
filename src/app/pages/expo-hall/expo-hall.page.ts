import { Component, ViewChild } from '@angular/core';

import { ExpoHallMapComponent } from '../../expo-hall-map/expo-hall-map.component';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-expo-hall',
  templateUrl: './expo-hall.page.html',
  styleUrls: ['./expo-hall.page.scss'],
})
export class ExpoHallPage {
  @ViewChild('expoMap') expoMap!: ExpoHallMapComponent;

  constructor(public liveUpdateService: LiveUpdateService) {}

  toggleSearch() {
    this.expoMap?.toggleSearch();
  }
}
