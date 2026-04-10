import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-session-types',
  templateUrl: './session-types.page.html',
  styleUrls: ['./session-types.page.scss'],
})
export class SessionTypesPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  constructor(
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }
}
