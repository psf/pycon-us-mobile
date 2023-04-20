import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoorCheckPage } from './door-check.page';

const routes: Routes = [
  {
    path: '',
    component: DoorCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoorCheckPageRoutingModule {}
