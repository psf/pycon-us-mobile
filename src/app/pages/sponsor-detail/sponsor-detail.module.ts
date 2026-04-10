import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorDetailPage } from './sponsor-detail';
import { SponsorDetailPageRoutingModule } from './sponsor-detail-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SponsorDetailPageRoutingModule,
  ],
  declarations: [
    SponsorDetailPage,
  ]
})
export class SponsorDetailModule { }
