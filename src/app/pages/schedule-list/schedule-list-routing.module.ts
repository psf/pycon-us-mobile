import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleListPage } from './schedule-list.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleListPageRoutingModule {}
