import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionDetailPage } from './session-detail';
import { SessionDetailPageRoutingModule } from './session-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes/pipes.module';
import { FloorPlanModalModule } from '../../floor-plan-modal/floor-plan-modal.module';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SessionDetailPageRoutingModule,
    PipesModule,
    FloorPlanModalModule,
    ScrollToTopModule
  ],
  declarations: [
    SessionDetailPage,
  ]
})
export class SessionDetailModule { }
