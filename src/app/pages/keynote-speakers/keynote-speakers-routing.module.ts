import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeynoteSpeakersPage } from './keynote-speakers.page';

const routes: Routes = [{ path: '', component: KeynoteSpeakersPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeynoteSpeakersPageRoutingModule {}
