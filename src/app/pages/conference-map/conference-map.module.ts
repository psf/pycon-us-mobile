import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';

import { ConferenceMapPageRoutingModule } from './conference-map-routing.module';

import { ConferenceMapPage } from './conference-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinchZoomModule,
    ConferenceMapPageRoutingModule
  ],
  declarations: [ConferenceMapPage]
})
export class ConferenceMapPageModule {}
