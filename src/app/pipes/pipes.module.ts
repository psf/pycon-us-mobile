import { NgModule } from '@angular/core';
import { TrackNamePipe } from './track-name.pipe';

@NgModule({
  declarations: [TrackNamePipe],
  exports: [TrackNamePipe]
})
export class PipesModule {}
