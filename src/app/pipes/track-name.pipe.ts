import { Pipe, PipeTransform } from '@angular/core';

const TRACK_DISPLAY_NAMES: Record<string, string> = {
  'Ai': 'AI',
  'Lightning-talks': 'Lightning Talks',
};

const TRACK_PLURAL_NAMES: Record<string, string> = {
  'Ai': 'Future of AI with Python',
  'Security': 'Trailblazing Python Security',
  'Talk': 'Talks',
  'Keynote': 'Keynotes',
  'Tutorial': 'Tutorials',
  'Charla': 'Charlas',
  'Poster': 'Posters',
  'Lightning-talks': 'Lightning Talks',
  'Plenary': 'Plenaries',
  'Break': 'Breaks',
  'Sponsor Presentation': 'Sponsor Presentations',
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
    if (format === 'plural' && TRACK_PLURAL_NAMES[value]) return TRACK_PLURAL_NAMES[value];
    if (TRACK_DISPLAY_NAMES[value]) return TRACK_DISPLAY_NAMES[value];
    return value.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
