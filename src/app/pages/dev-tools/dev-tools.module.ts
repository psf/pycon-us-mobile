import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DevToolsPageRoutingModule } from './dev-tools-routing.module';
import { DevToolsPage } from './dev-tools.page';

@NgModule({
  imports: [CommonModule, IonicModule, DevToolsPageRoutingModule],
  declarations: [DevToolsPage]
})
export class DevToolsPageModule {}
