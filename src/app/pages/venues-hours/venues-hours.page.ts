import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-venues-hours',
  templateUrl: './venues-hours.page.html',
  styleUrls: ['./venues-hours.page.scss'],
})
export class VenuesHoursPage implements OnInit {
  content: any = '';

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

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
