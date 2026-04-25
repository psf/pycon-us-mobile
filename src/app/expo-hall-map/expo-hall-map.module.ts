import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PinchZoomModule } from '@ciag/ngx-pinch-zoom';

import { ExpoHallMapComponent } from './expo-hall-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PinchZoomModule,
    RouterModule,
  ],
  declarations: [ExpoHallMapComponent],
  exports: [ExpoHallMapComponent],
})
export class ExpoHallMapModule {}
