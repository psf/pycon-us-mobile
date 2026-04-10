import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionTypesPage } from './session-types.page';

const routes: Routes = [
  {
    path: '',
    component: SessionTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionTypesPageRoutingModule {}
