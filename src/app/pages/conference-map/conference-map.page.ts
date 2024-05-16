import { Component, OnInit } from '@angular/core';

import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'app-conference-map',
  templateUrl: './conference-map.page.html',
  styleUrls: ['./conference-map.page.scss'],
})
export class ConferenceMapPage implements OnInit {

  constructor(
    public liveUpdateService: LiveUpdateService,
  ) { }

  ngOnInit() {
  }

}
