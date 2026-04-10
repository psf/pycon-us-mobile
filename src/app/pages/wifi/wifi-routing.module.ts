import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WifiPage } from './wifi.page';

const routes: Routes = [
  {
    path: '',
    component: WifiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WifiPageRoutingModule {}
