import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoorCheckPageRoutingModule } from './door-check-routing.module';

import { DoorCheckPage } from './door-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoorCheckPageRoutingModule
  ],
  declarations: [DoorCheckPage]
})
export class DoorCheckPageModule {}
