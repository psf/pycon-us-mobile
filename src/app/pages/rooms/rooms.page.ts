import { Component, OnInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  rooms: any[] = [];

  constructor(private confData: ConferenceData) {}

  ngOnInit() {
    this.confData.getRooms().subscribe((rooms: any[]) => {
      this.rooms = rooms;
    });
  }
}
