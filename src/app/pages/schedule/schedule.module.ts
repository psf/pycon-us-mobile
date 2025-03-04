import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { SessionOrderPipe } from '../../pipes/session-order.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SchedulePageRoutingModule
    ],
    declarations: [
        SchedulePage,
        ScheduleFilterPage,
        SessionOrderPipe
    ]
})
export class ScheduleModule { }
