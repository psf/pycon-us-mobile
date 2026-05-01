import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorDetailPage } from './sponsor-detail';
import { SponsorDetailPageRoutingModule } from './sponsor-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SponsorDetailPageRoutingModule,
    ScrollToTopModule,
  ],
  declarations: [
    SponsorDetailPage,
  ]
})
export class SponsorDetailModule { }
