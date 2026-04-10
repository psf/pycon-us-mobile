import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenuesHoursPage } from './venues-hours.page';

const routes: Routes = [
  {
    path: '',
    component: VenuesHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenuesHoursPageRoutingModule {}
