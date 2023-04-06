import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutPyconPage } from './about-pycon.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPyconPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPyconPageRoutingModule {}
