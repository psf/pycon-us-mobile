import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LightningTalksPage } from './lightning-talks.page';

const routes: Routes = [{ path: '', component: LightningTalksPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightningTalksPageRoutingModule {}
