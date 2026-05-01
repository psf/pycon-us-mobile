import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoomsPageRoutingModule } from './rooms-routing.module';
import { RoomsPage } from './rooms.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [CommonModule, IonicModule, RoomsPageRoutingModule, ScrollToTopModule],
  declarations: [RoomsPage],
})
export class RoomsPageModule {}
