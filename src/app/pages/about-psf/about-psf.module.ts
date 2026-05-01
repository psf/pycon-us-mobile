import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPsfPageRoutingModule } from './about-psf-routing.module';

import { AboutPsfPage } from './about-psf.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutPsfPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [AboutPsfPage]
})
export class AboutPsfPageModule {}
