import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@ciag/ngx-pinch-zoom';

import { FloorPlanModalComponent } from './floor-plan-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule, PinchZoomModule],
  declarations: [FloorPlanModalComponent],
  exports: [FloorPlanModalComponent],
})
export class FloorPlanModalModule {}
