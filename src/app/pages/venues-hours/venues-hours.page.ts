import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-venues-hours',
  templateUrl: './venues-hours.page.html',
  styleUrls: ['./venues-hours.page.scss'],
})
export class VenuesHoursPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  content: any = '';
  showTitle = false;

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }

  ngOnInit() {
    this.confData.getContent().subscribe((content: any) => {
      this.content = content;
      this.changeDetection.detectChanges();
    });
  }
}
