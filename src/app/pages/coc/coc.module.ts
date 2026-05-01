import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CocPageRoutingModule } from './coc-routing.module';
import { CocPage } from './coc.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CocPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [CocPage]
})
export class CocPageModule {}
