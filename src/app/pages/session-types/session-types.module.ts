import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SessionTypesPageRoutingModule } from './session-types-routing.module';
import { SessionTypesPage } from './session-types.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SessionTypesPageRoutingModule
  ],
  declarations: [SessionTypesPage]
})
export class SessionTypesPageModule {}
