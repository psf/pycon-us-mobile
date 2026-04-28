import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinchZoomModule } from '@ciag/ngx-pinch-zoom';

import { ExpoHallMapModule } from '../../expo-hall-map/expo-hall-map.module';
import { FloorPlanModalComponent } from '../../floor-plan-modal/floor-plan-modal.component';

import { ConferenceMapPageRoutingModule } from './conference-map-routing.module';

import { ConferenceMapPage } from './conference-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinchZoomModule,
    ExpoHallMapModule,
    ConferenceMapPageRoutingModule
  ],
  declarations: [ConferenceMapPage, FloorPlanModalComponent]
})
export class ConferenceMapPageModule {}
