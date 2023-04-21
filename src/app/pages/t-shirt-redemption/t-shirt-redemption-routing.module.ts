import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TShirtRedemptionPage } from './t-shirt-redemption.page';

const routes: Routes = [
  {
    path: '',
    component: TShirtRedemptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TShirtRedemptionPageRoutingModule {}
