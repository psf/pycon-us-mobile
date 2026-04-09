import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SprintsPageRoutingModule } from './sprints-routing.module';

import { SprintsPage } from './sprints.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SprintsPageRoutingModule
  ],
  declarations: [SprintsPage]
})
export class SprintsPageModule {}
