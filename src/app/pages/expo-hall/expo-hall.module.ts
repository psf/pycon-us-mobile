import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpoHallMapModule } from '../../expo-hall-map/expo-hall-map.module';

import { ExpoHallPageRoutingModule } from './expo-hall-routing.module';

import { ExpoHallPage } from './expo-hall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpoHallMapModule,
    ExpoHallPageRoutingModule,
  ],
  declarations: [ExpoHallPage]
})
export class ExpoHallPageModule {}
