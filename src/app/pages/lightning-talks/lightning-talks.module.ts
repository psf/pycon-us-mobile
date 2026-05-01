import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LightningTalksPageRoutingModule } from './lightning-talks-routing.module';
import { LightningTalksPage } from './lightning-talks.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [CommonModule, IonicModule, LightningTalksPageRoutingModule, ScrollToTopModule],
  declarations: [LightningTalksPage]
})
export class LightningTalksPageModule {}
