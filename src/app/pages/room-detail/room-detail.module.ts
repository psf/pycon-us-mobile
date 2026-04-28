import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LocationMapModule } from '../../location-map/location-map.module';
import { RoomDetailPageRoutingModule } from './room-detail-routing.module';
import { RoomDetailPage } from './room-detail.page';

@NgModule({
  imports: [CommonModule, IonicModule, LocationMapModule, RoomDetailPageRoutingModule],
  declarations: [RoomDetailPage],
})
export class RoomDetailPageModule {}
