import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationMapModule } from '../../location-map/location-map.module';

import { VenuesHoursPageRoutingModule } from './venues-hours-routing.module';
import { VenuesHoursPage } from './venues-hours.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LocationMapModule,
    VenuesHoursPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [VenuesHoursPage]
})
export class VenuesHoursPageModule {}
