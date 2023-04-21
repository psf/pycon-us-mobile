import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TShirtRedemptionPageRoutingModule } from './t-shirt-redemption-routing.module';

import { TShirtRedemptionPage } from './t-shirt-redemption.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TShirtRedemptionPageRoutingModule
  ],
  declarations: [TShirtRedemptionPage]
})
export class TShirtRedemptionPageModule {}
