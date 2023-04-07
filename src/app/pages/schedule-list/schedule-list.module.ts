import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleListPageRoutingModule } from './schedule-list-routing.module';

import { ScheduleListPage } from './schedule-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleListPageRoutingModule
  ],
  declarations: [ScheduleListPage]
})
export class ScheduleListPageModule {}
