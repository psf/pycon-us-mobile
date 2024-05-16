import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConferenceMapPage } from './conference-map.page';

const routes: Routes = [
  {
    path: '',
    component: ConferenceMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferenceMapPageRoutingModule {}
