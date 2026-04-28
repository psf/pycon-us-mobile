import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FloorPlanModalModule } from '../floor-plan-modal/floor-plan-modal.module';

import { LocationMapComponent } from './location-map.component';

@NgModule({
  imports: [CommonModule, IonicModule, FloorPlanModalModule],
  declarations: [LocationMapComponent],
  exports: [LocationMapComponent],
})
export class LocationMapModule {}
