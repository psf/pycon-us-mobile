import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-coc',
  templateUrl: './coc.page.html',
  styleUrls: ['./coc.page.scss'],
})
export class CocPage implements OnInit {
  content: any = '';

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  ngOnInit() {
    this.confData.getContent().subscribe((content: any) => {
      this.content = content;
      this.changeDetection.detectChanges();
    });
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }
}
