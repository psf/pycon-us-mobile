import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { Config, InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.page.html',
  styleUrls: ['./schedule-list.page.scss'],
})
export class ScheduleListPage implements OnInit {
  // Get a reference to the search bar
  @ViewChild('search') search : any;
  trackName: string;
  trackSlug: string;
  excludeTracks: any[] = [];

  sessions: any[] = [];
  displaySessions: any[] = [];
  sessionsByDay: any = {};
  dayOrder = ['Fri', 'Sat', 'Sun'];
  sessionQueryText = '';
  isOpenSpaceView = false;

  ios: boolean;
  showSearchbar: boolean;
  page: number = 0;
  scrolling: boolean = false;

  constructor(
    public confData: ConferenceData,
    public config: Config,
    private changeDetection: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    public liveUpdateService: LiveUpdateService,
  ) { }


  updateSessions() {
    this.confData.getSessions(this.sessionQueryText, this.excludeTracks).subscribe((sessions: any[]) => {
      this.sessions = sessions;
      this.generateSessions();
    });
  }

  searchSessions() {
    this.scrolling = false;
    this.displaySessions = [];
    this.confData.getSessions(this.sessionQueryText, this.excludeTracks).subscribe((sessions: any[]) => {
      this.displaySessions = sessions;
      this.organizeSessionsByDay();
    });
  }

  resetSessions() {
    this.page = 0;
    this.scrolling = true;
    this.sessionQueryText = "";
    this.sessions = [];
    this.displaySessions = [];
    this.sessionsByDay = {};
    this.reloadSessions();
  }

  organizeSessionsByDay() {
    if (!this.isOpenSpaceView) return;
    
    this.sessionsByDay = {};
    this.dayOrder.forEach(day => this.sessionsByDay[day] = []);
    
    this.displaySessions.forEach(session => {
      if (this.sessionsByDay[session.day]) {
        this.sessionsByDay[session.day].push(session);
      }
    });
  }

  async generateSessions() {
    if (this.page >= 0) {
      this.sessions.slice(25*this.page, 25*this.page + 25).forEach(session => this.displaySessions.push(session));
      if (this.sessions.length == this.displaySessions.length) {
        this.page = -1
        this.scrolling = false;
      } else {
        this.page += 1;
        this.scrolling = true;
      }
      this.organizeSessionsByDay();
    }
  }

  onIonInfinite(ev) {
    this.generateSessions().then(() => {
      setTimeout(() => {(ev as InfiniteScrollCustomEvent).target.complete()}, 200);
    });
  }

  reloadSessions() {
    this.scrolling = false;
    console.log('fetching sessions');
    this.loadingCtrl.create({
      message: 'Fetching latest sessions...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      this.displaySessions = [];
      this.confData.getSessions(this.sessionQueryText, this.excludeTracks).subscribe((sessions: any[]) => {
        this.sessions = sessions;
        this.generateSessions();
        setTimeout(() => {loader.dismiss()}, 100);
      });
    });
  }

  async focusButton() {
     setTimeout(() => {
       this.search.setFocus();
     }, 500); // ms delay
   }

  ionViewWillLeave() {
    console.log('here');
  }

  initSchedule(slug) {
    this.trackSlug = slug
    this.trackName = ""
    this.excludeTracks = []
    this.isOpenSpaceView = slug === 'open-spaces';
    
    this.confData.load().subscribe((data: any) => {
      if (data.sessions) {
        this.confData.getTracks().subscribe((tracks: any[]) => {
          tracks.forEach((track, index, arr) => {
            if (slugify(track.name+'s') !== this.trackSlug) {
              this.excludeTracks.push(track.name);
            } else {
              this.trackName = track.name + 's';
            }
          })
        });
        this.resetSessions();
      }
    });
  }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';

    this.route.params.subscribe(routeParams => {
      console.log(routeParams);
      this.initSchedule(routeParams.trackSlug);
    });
  }
}
