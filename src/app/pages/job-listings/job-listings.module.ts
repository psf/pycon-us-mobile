import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobListingsPageRoutingModule } from './job-listings-routing.module';

import { JobListingsPage } from './job-listings.page';
import { FloorPlanModalModule } from '../../floor-plan-modal/floor-plan-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobListingsPageRoutingModule,
    FloorPlanModalModule
  ],
  declarations: [JobListingsPage]
})
export class JobListingsPageModule {}
