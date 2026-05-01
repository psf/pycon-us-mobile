import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SessionTypesPageRoutingModule } from './session-types-routing.module';
import { SessionTypesPage } from './session-types.page';
import { ScrollToTopModule } from '../../scroll-to-top/scroll-to-top.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SessionTypesPageRoutingModule,
    ScrollToTopModule
  ],
  declarations: [SessionTypesPage]
})
export class SessionTypesPageModule {}
