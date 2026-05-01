import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { KeynoteSpeakersPageRoutingModule } from './keynote-speakers-routing.module';
import { KeynoteSpeakersPage } from './keynote-speakers.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [CommonModule, IonicModule, KeynoteSpeakersPageRoutingModule, ScrollToTopModule],
  declarations: [KeynoteSpeakersPage]
})
export class KeynoteSpeakersPageModule {}
