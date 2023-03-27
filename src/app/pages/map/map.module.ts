import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DateAgoPipe } from '../../pipes/date-ago.pipe';

import { MapPage } from './map';
import { MapPageRoutingModule } from './map-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MapPageRoutingModule,
  ],
  declarations: [
    MapPage,
    DateAgoPipe,
  ]
})
export class MapModule { }
