import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { VenuesHoursPageRoutingModule } from './venues-hours-routing.module';
import { VenuesHoursPage } from './venues-hours.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VenuesHoursPageRoutingModule
  ],
  declarations: [VenuesHoursPage]
})
export class VenuesHoursPageModule {}
