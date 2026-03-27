import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpeakerDetailPage } from './speaker-detail';
import { SpeakerDetailPageRoutingModule } from './speaker-detail-routing.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpeakerDetailPageRoutingModule,
    PipesModule
  ],
  declarations: [
    SpeakerDetailPage,
  ]
})
export class SpeakerDetailModule { }
