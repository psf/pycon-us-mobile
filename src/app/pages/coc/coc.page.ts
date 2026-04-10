import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-coc',
  templateUrl: './coc.page.html',
  styleUrls: ['./coc.page.scss'],
})
export class CocPage implements OnInit {
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
