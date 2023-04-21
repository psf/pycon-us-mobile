import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaskViolationPageRoutingModule } from './mask-violation-routing.module';

import { MaskViolationPage } from './mask-violation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaskViolationPageRoutingModule
  ],
  declarations: [MaskViolationPage]
})
export class MaskViolationPageModule {}
