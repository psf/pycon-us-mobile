import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationMapModule } from '../../location-map/location-map.module';

import { VenuesHoursPageRoutingModule } from './venues-hours-routing.module';
import { VenuesHoursPage } from './venues-hours.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LocationMapModule,
    VenuesHoursPageRoutingModule
  ],
  declarations: [VenuesHoursPage]
})
export class VenuesHoursPageModule {}
