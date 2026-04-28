export interface VenueLocation {
  key: string;
  label: string;
  sublabel?: string;
  floorTitle: string;
  thumbSrc: string;
  fullSrc: string;
  pinXPct: number;
  pinYPct: number;
}

const CONCOURSE_THUMB = 'assets/img/floor-plans/floor-plan-1-thumb.jpg';
const CONCOURSE_FULL = 'assets/img/floor-plans/floor-plan-1.jpg';
const CONCOURSE_TITLE = 'Concourse Level';

const UPPER_THUMB = 'assets/img/floor-plans/floor-plan-2-thumb.jpg';
const UPPER_FULL = 'assets/img/floor-plans/floor-plan-2.jpg';
const UPPER_TITLE = 'Upper Level';

const ARENA_THUMB = 'assets/img/floor-plans/floor-plan-3-thumb.jpg';
const ARENA_FULL = 'assets/img/floor-plans/floor-plan-3.jpg';
const ARENA_TITLE = 'Arena & Exhibit Halls';

export const VENUE_LOCATIONS: Record<string, VenueLocation> = {
  infoDesk: {
    key: 'infoDesk',
    label: 'Information Desk',
    sublabel: 'Promenade Lobby (Main Entrance)',
    floorTitle: CONCOURSE_TITLE,
    thumbSrc: CONCOURSE_THUMB,
    fullSrc: CONCOURSE_FULL,
    pinXPct: 55,
    pinYPct: 53,
  },
  registration: {
    key: 'registration',
    label: 'Registration',
    sublabel: 'Promenade Lobby (Main Entrance)',
    floorTitle: CONCOURSE_TITLE,
    thumbSrc: CONCOURSE_THUMB,
    fullSrc: CONCOURSE_FULL,
    pinXPct: 67,
    pinYPct: 58,
  },
  quietRoom: {
    key: 'quietRoom',
    label: 'Attendee Quiet Room',
    sublabel: 'VIP Room A & B',
    floorTitle: CONCOURSE_TITLE,
    thumbSrc: CONCOURSE_THUMB,
    fullSrc: CONCOURSE_FULL,
    pinXPct: 58,
    pinYPct: 36,
  },
  swagPickup: {
    key: 'swagPickup',
    label: 'Swag Pickup',
    sublabel: 'Expo Hall A & B',
    floorTitle: ARENA_TITLE,
    thumbSrc: ARENA_THUMB,
    fullSrc: ARENA_FULL,
    pinXPct: 42,
    pinYPct: 68,
  },
  lostAndFound: {
    key: 'lostAndFound',
    label: 'Lost & Found',
    sublabel: 'Info Desk during open hours; Staff Office overnight',
    floorTitle: UPPER_TITLE,
    thumbSrc: UPPER_THUMB,
    fullSrc: UPPER_FULL,
    pinXPct: 40,
    pinYPct: 58,
  },
  staffOffice: {
    key: 'staffOffice',
    label: 'Staff Office',
    sublabel: 'Room 203 A & B',
    floorTitle: UPPER_TITLE,
    thumbSrc: UPPER_THUMB,
    fullSrc: UPPER_FULL,
    pinXPct: 40,
    pinYPct: 58,
  },
};
