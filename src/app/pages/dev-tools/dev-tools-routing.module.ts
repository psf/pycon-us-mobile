import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevToolsPage } from './dev-tools.page';

const routes: Routes = [{ path: '', component: DevToolsPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevToolsPageRoutingModule {}
