import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CocPage } from './coc.page';

const routes: Routes = [
  {
    path: '',
    component: CocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CocPageRoutingModule {}
