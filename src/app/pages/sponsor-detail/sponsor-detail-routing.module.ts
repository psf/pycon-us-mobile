import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SponsorDetailPage } from './sponsor-detail';

const routes: Routes = [
  {
    path: '',
    component: SponsorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorDetailPageRoutingModule { }
