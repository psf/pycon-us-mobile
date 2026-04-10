import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CocPageRoutingModule } from './coc-routing.module';
import { CocPage } from './coc.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CocPageRoutingModule
  ],
  declarations: [CocPage]
})
export class CocPageModule {}
