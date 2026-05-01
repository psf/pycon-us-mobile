import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { WifiPageRoutingModule } from './wifi-routing.module';
import { WifiPage } from './wifi.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WifiPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [WifiPage]
})
export class WifiPageModule {}
