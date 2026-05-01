import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialMediaPageRoutingModule } from './social-media-routing.module';

import { SocialMediaPage } from './social-media.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialMediaPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [SocialMediaPage]
})
export class SocialMediaPageModule {}
