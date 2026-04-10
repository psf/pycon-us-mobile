import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { KeynoteSpeakersPageRoutingModule } from './keynote-speakers-routing.module';
import { KeynoteSpeakersPage } from './keynote-speakers.page';

@NgModule({
  imports: [CommonModule, IonicModule, KeynoteSpeakersPageRoutingModule],
  declarations: [KeynoteSpeakersPage]
})
export class KeynoteSpeakersPageModule {}
