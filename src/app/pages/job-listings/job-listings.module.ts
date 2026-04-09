import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobListingsPageRoutingModule } from './job-listings-routing.module';

import { JobListingsPage } from './job-listings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobListingsPageRoutingModule
  ],
  declarations: [JobListingsPage]
})
export class JobListingsPageModule {}
