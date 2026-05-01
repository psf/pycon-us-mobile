import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ScrollToTopComponent } from './scroll-to-top.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [ScrollToTopComponent],
  exports: [ScrollToTopComponent],
})
export class ScrollToTopModule {}
