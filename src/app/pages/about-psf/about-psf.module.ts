import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPsfPageRoutingModule } from './about-psf-routing.module';

import { AboutPsfPage } from './about-psf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPsfPageRoutingModule
  ],
  declarations: [AboutPsfPage]
})
export class AboutPsfPageModule {}
