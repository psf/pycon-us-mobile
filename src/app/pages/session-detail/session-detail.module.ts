import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionDetailPage } from './session-detail';
import { SessionDetailPageRoutingModule } from './session-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SessionDetailPageRoutingModule,
    PipesModule
  ],
  declarations: [
    SessionDetailPage,
  ]
})
export class SessionDetailModule { }
