import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';

import { AutofillDirective } from './autofill.directive';
import { LiveUpdateService } from './providers/live-update.service';
import { LeadNoteModalComponent } from './lead-note-modal/lead-note-modal.component';
import { RedemptionModalComponent } from './redemption-modal/redemption-modal.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: environment.storageKey
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [AppComponent, AutofillDirective, LeadNoteModalComponent, RedemptionModalComponent],
  providers: [LiveUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule {}
