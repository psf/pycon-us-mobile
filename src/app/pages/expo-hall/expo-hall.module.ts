import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PinchZoomModule } from '@ciag/ngx-pinch-zoom';

import { ExpoHallPageRoutingModule } from './expo-hall-routing.module';

import { ExpoHallPage } from './expo-hall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinchZoomModule,
    ExpoHallPageRoutingModule
  ],
  declarations: [ExpoHallPage]
})
export class ExpoHallPageModule {}
