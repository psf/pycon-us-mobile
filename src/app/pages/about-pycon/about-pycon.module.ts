import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPyconPageRoutingModule } from './about-pycon-routing.module';

import { AboutPyconPage } from './about-pycon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPyconPageRoutingModule
  ],
  declarations: [AboutPyconPage]
})
export class AboutPyconPageModule {}
