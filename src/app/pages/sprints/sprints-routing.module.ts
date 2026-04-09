import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SprintsPage } from './sprints.page';

const routes: Routes = [
  {
    path: '',
    component: SprintsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SprintsPageRoutingModule {}
