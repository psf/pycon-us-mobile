import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleListPageRoutingModule } from './schedule-list-routing.module';

import { ScheduleListPage } from './schedule-list.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleListPageRoutingModule,
    PipesModule,
    ScrollToTopModule
  ],
  declarations: [ScheduleListPage]
})
export class ScheduleListPageModule {}
