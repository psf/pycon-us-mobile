import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobListingsPage } from './job-listings.page';

const routes: Routes = [
  {
    path: '',
    component: JobListingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobListingsPageRoutingModule {}
