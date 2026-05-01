import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LocationMapModule } from '../../location-map/location-map.module';

import { HelpPageRoutingModule } from './help-routing.module';
import { HelpPage } from './help.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LocationMapModule,
    HelpPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
