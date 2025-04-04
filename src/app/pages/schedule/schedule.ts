import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit, OnDestroy {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;
  // Get a reference to the search bar
  @ViewChild('search') search : any;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  ios: boolean;
  hasData: boolean = false;
  dayIndex = "0";
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  days: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  currentTime: Date;
  private favoritesSubscription: Subscription;

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public route: ActivatedRoute,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config,
    public liveUpdateService: LiveUpdateService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.ios = this.config.get('mode') === 'ios';
    this.user.getScheduleFilters().then(filters => {
      this.excludeTracks = filters;
    });

    // Subscribe to favorites changes via an RxJS Subscription
    this.favoritesSubscription = this.user.favoritesChanged$.subscribe(() => {
      this.updateSchedule();
      this.changeDetectorRef.detectChanges();
    });

    this.currentTime = new Date();
    this.confData.getDays(this.excludeTracks, this.segment).subscribe((data: any) => {
      console.log(data)
      var currDay = data.filter(d => d.date === this.currentTime.toISOString().split("T")[0]);
      console.log(currDay)
      if (currDay.length > 0) {
        this.dayIndex = currDay[0].index;
      }
    });

    this.dayIndex = "0";

    this.route.params.subscribe(routeParams => {
      this.reloadSchedule();
    })
  }

  ngOnDestroy() {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  ionViewDidEnter() {
    //const id = document.getElementsByClassName("future")[0] as HTMLElement
    //console.log(id)
    //console.log(this.content)
    //console.log(id.offsetTop);
    //this.content.scrollToBottom();
    //this.content.scrollToPoint(0, id.offsetTop-60, 500)
  }

  async handleRefresh(event) {
    this.reloadSchedule().then(() => {
      setTimeout(() => {
        event.target.complete();
      }, 250);
    });
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getDays(this.excludeTracks, this.segment).subscribe((data: any) => {
      this.days = data;
    });

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });

    this.changeDetectorRef.detectChanges();
  }

  async reloadSchedule() {
    console.log('fetching schedule');
    this.loadingCtrl.create({
      message: 'Fetching latest schedule...',
      duration: 10000,
    }).then((loader) => {
      loader.present();
      // Close any open sliding items when the schedule updates
      if (this.scheduleList) {
        this.scheduleList.closeSlidingItems();
      }

      this.confData.getDays(this.excludeTracks, this.segment).subscribe((data: any) => {
        this.days = data;
      });

      this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
        this.shownSessions = data.shownSessions;
        this.groups = data.groups;
        this.hasData = true;
        loader.dismiss();
      });
    });
  }

  async focusButton() {
    setTimeout(() => {
      this.search.setFocus();
    }, 500); // ms delay
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    // Add as a favorite
    this.user.addFavorite(sessionData.id);

    // Close the open item
    slidingItem.close();

    // Create a toast
    const toast = await this.toastCtrl.create({
      header: `${sessionData.name} was successfully added as a favorite.`,
      duration: 3000,
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });

    // Present the toast at the bottom of the page
    await toast.present();
  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    // Remove from favorites
    this.user.removeFavorite(sessionData.id);

    // Close the open item
    slidingItem.close();

    // Create a toast
    const toast = await this.toastCtrl.create({
      header: `${sessionData.name} was successfully removed from favorites.`,
      duration: 3000,
      buttons: [{
        text: 'Close',
        role: 'cancel'
      }]
    });

    // Present the toast at the bottom of the page
    await toast.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }
}
