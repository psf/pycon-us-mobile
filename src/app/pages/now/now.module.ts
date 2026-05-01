import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NowPageRoutingModule } from './now-routing.module';
import { PipesModule } from '../../pipes/pipes.module';

import { NowPage } from './now.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NowPageRoutingModule,
    PipesModule,
    ScrollToTopModule
  ],
  declarations: [NowPage]
})
export class NowPageModule {}
