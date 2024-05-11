import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpoHallPage } from './expo-hall.page';

const routes: Routes = [
  {
    path: '',
    component: ExpoHallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpoHallPageRoutingModule {}
