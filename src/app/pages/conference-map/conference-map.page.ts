import { Component, ViewChild } from '@angular/core';

import { ExpoHallMapComponent } from '../../expo-hall-map/expo-hall-map.component';
import { LiveUpdateService } from '../../providers/live-update.service';

type MapView = 'floor-plans' | '3d-tour' | 'expo-hall';

@Component({
  selector: 'app-conference-map',
  templateUrl: './conference-map.page.html',
  styleUrls: ['./conference-map.page.scss'],
})
export class ConferenceMapPage {
  @ViewChild('expoMap') expoMap?: ExpoHallMapComponent;

  mapView: MapView = 'floor-plans';

  constructor(
    public liveUpdateService: LiveUpdateService,
  ) { }

  toggleExpoSearch() {
    this.expoMap?.toggleSearch();
  }
}
