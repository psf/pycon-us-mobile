import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-now',
  templateUrl: './now.page.html',
  styleUrls: ['./now.page.scss'],
})
export class NowPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;
  nowSessions: any[] = [];
  nextSessions: any[] = [];
  nextTime: string = '';
  currentTime: Date;
  noConference: boolean = false;
  private refreshInterval: any;

  constructor(private confData: ConferenceData) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  ngOnInit() {
    this.refresh();
    this.refreshInterval = setInterval(() => this.refresh(), 60000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  ionViewWillEnter() {
    this.refresh();
  }

  refresh() {
    this.currentTime = new Date();
    this.confData.load().subscribe((data: any) => {
      if (!data.schedule) return;

      const todayISO = this.currentTime.toLocaleDateString('en-CA', { timeZone: environment.timezone });
      const scheduleDay = data.schedule.find((d: any) => d.date === todayISO);

      if (!scheduleDay) {
        this.noConference = true;
        this.nowSessions = [];
        this.nextSessions = [];
        return;
      }

      this.noConference = false;
      const now = this.currentTime.getTime();

      // Find the current group (most recent group that has started)
      const sortedGroups = [...scheduleDay.groups]
        .filter((g: any) => g.startTime)
        .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

      const currentGroup = sortedGroups
        .filter((g: any) => new Date(g.startTime).getTime() <= now)
        .pop();

      if (currentGroup) {
        this.nowSessions = currentGroup.sessions.filter((s: any) => !s.hide);
      } else {
        this.nowSessions = [];
      }

      // Find next time slot
      const futureGroups = sortedGroups
        .filter((g: any) => new Date(g.startTime).getTime() > now);

      if (futureGroups.length > 0) {
        this.nextTime = futureGroups[0].time;
        this.nextSessions = futureGroups[0].sessions.filter((s: any) => !s.hide);
      } else {
        this.nextTime = '';
        this.nextSessions = [];
      }
    });
  }
}
