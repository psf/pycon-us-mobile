import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';

@NgModule({
  imports: [CommonModule, IonicModule, RoomsPageRoutingModule],
  declarations: [RoomsPage],
})
export class RoomsPageModule {}
