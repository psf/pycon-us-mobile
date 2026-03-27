import { Pipe, PipeTransform } from '@angular/core';

const TRACK_DISPLAY_NAMES: Record<string, string> = {
  'Ai': 'AI',
  'Lightning-talks': 'Lightning Talks',
};

const TRACK_LONG_NAMES: Record<string, string> = {
  'Ai': 'The Future of AI with Python',
  'Security': 'Trailblazing Python Security',
};

@Pipe({
  name: 'trackName'
})
export class TrackNamePipe implements PipeTransform {
  transform(value: string, format: string = 'short'): string {
    if (!value) return value;
    if (format === 'long' && TRACK_LONG_NAMES[value]) return TRACK_LONG_NAMES[value];
    if (TRACK_DISPLAY_NAMES[value]) return TRACK_DISPLAY_NAMES[value];
    return value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
