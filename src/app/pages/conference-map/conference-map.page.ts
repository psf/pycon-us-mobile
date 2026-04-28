import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ExpoHallMapComponent } from '../../expo-hall-map/expo-hall-map.component';
import { FloorPlanModalComponent } from '../../floor-plan-modal/floor-plan-modal.component';
import { LiveUpdateService } from '../../providers/live-update.service';

type MapView = 'floor-plans' | '3d-tour' | 'expo-hall';

interface FloorPlan {
  id: string;
  title: string;
  subtitle?: string;
  thumb: string;
  full: string;
}

@Component({
  selector: 'app-conference-map',
  templateUrl: './conference-map.page.html',
  styleUrls: ['./conference-map.page.scss'],
})
export class ConferenceMapPage implements OnInit {
  @ViewChild('expoMap') expoMap?: ExpoHallMapComponent;

  mapView: MapView = 'floor-plans';
  pageTitle = 'Conference Center';

  floorPlans: FloorPlan[] = [
    {
      id: 'campus',
      title: 'Campus Overview',
      subtitle: 'Convention center, hotels, halls, and entrances',
      thumb: 'assets/img/floor-plans/campus-map-thumb.jpg',
      full: 'assets/img/floor-plans/campus-map.jpg',
    },
    {
      id: 'concourse',
      title: 'Concourse Level',
      subtitle: 'Tutorials, Talk Track, Registration, Expo entry',
      thumb: 'assets/img/floor-plans/floor-plan-1-thumb.jpg',
      full: 'assets/img/floor-plans/floor-plan-1.jpg',
    },
    {
      id: 'upper',
      title: 'Upper Level',
      subtitle: 'Talk Track, Sponsor Presentations, Speaker Ready, Summits',
      thumb: 'assets/img/floor-plans/floor-plan-2-thumb.jpg',
      full: 'assets/img/floor-plans/floor-plan-2.jpg',
    },
    {
      id: 'arena',
      title: 'Arena & Exhibit Halls',
      subtitle: 'Keynotes, Lightning Talks, Expo Hall, Job Fair',
      thumb: 'assets/img/floor-plans/floor-plan-3-thumb.jpg',
      full: 'assets/img/floor-plans/floor-plan-3.jpg',
    },
    {
      id: 'seaside',
      title: 'Seaside Meeting Rooms',
      subtitle: 'Sprints, Open Spaces, PyLadies Auction, Web Assembly Summit',
      thumb: 'assets/img/floor-plans/floor-plan-4-thumb.jpg',
      full: 'assets/img/floor-plans/floor-plan-4.jpg',
    },
  ];

  constructor(
    public liveUpdateService: LiveUpdateService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const data = r.snapshot.data || {};
      if (data['initialView']) {
        this.mapView = data['initialView'] as MapView;
      }
      if (data['pageTitle']) {
        this.pageTitle = data['pageTitle'];
      }
      r = r.parent;
    }
  }

  toggleExpoSearch() {
    this.expoMap?.toggleSearch();
  }

  async openFloorPlan(plan: FloorPlan) {
    const modal = await this.modalCtrl.create({
      component: FloorPlanModalComponent,
      componentProps: {
        title: plan.title,
        imageSrc: plan.full,
        altText: `${plan.title} floor plan`,
      },
    });
    await modal.present();
  }
}
