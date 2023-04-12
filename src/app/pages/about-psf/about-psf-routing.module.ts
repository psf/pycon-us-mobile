import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutPsfPage } from './about-psf.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPsfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPsfPageRoutingModule {}
