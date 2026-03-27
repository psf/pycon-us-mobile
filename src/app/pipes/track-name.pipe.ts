import { Pipe, PipeTransform } from '@angular/core';

const TRACK_DISPLAY_NAMES: Record<string, string> = {
  'Ai': 'AI',
  'Lightning-talks': 'Lightning Talks',
};

@Pipe({
  name: 'trackName'
})
export class TrackNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    if (TRACK_DISPLAY_NAMES[value]) return TRACK_DISPLAY_NAMES[value];
    return value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
