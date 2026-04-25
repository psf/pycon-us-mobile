import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, LoadingController } from '@ionic/angular';

import { ConferenceData } from '../providers/conference-data';

export interface BoothData {
  id: string;
  name: string;
  top: number;
  left: number;
  width: number;
  height: number;
  imgW: number;
  imgH: number;
  logoUrl?: string;
  level?: string;
  description?: string;
}

@Component({
  selector: 'app-expo-hall-map',
  templateUrl: './expo-hall-map.component.html',
  styleUrls: ['./expo-hall-map.component.scss'],
})
export class ExpoHallMapComponent implements OnInit, AfterViewInit {
  @ViewChild('searchBar') searchBar!: IonSearchbar;
  @ViewChild('pinchZoom') pinchZoomCmp?: { pinchZoom?: { maxScale: number } };

  showSearchbar = false;
  searchQuery = '';
  searchResults: BoothData[] = [];
  selectedBooth: BoothData | null = null;
  highlightedBoothId: string | null = null;

  // Static logo fallbacks for booths that don't come through the sponsor API
  // (PSF, community booths, attendee lounge, etc.). Keyed by booth id.
  private readonly STATIC_BOOTH_LOGOS: { [id: string]: string } = {
    '407': 'assets/img/python-logo.png',
    '606': 'assets/img/pycon-us-2026-logo.svg',
  };

  // Booth coordinates in the original 8000×5655 floor plan image.
  // Names are the seed labels — they get overwritten with the live sponsor
  // name (and gain logoUrl/level/description) once the API responds.
  booths: BoothData[] = [
    { id: '245', name: 'Lerner Python Training',            top: 640,  left: 3271, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '344', name: 'Zyte',                              top: 649,  left: 3556, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '243', name: 'Analog Devices',                    top: 925,  left: 3271, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '342', name: 'marimo',                            top: 934,  left: 3547, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '638', name: 'AlphaSense',                        top: 978,  left: 5911, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '639', name: 'Snowflake',                         top: 978,  left: 6409, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '140', name: 'Chonkie',                           top: 1183, left: 1982, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '141', name: 'Tetrix',                            top: 1191, left: 2418, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '240', name: 'Mission',                           top: 1191, left: 2684, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '138', name: 'Sublimage',                         top: 1458, left: 1991, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '238', name: 'Jinja.App',                         top: 1458, left: 2684, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '635', name: 'ClickHouse',                        top: 1592, left: 6409, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '735', name: 'Python en Español',                 top: 1592, left: 7449, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '734', name: 'Djangonauts / DSF',                 top: 1600, left: 6693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '136', name: 'Capisclo',                          top: 1725, left: 1991, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '137', name: 'Arcjet',                            top: 1725, left: 2418, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '336', name: 'Astral',                            top: 1734, left: 3547, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '236', name: 'Minimus',                           top: 1743, left: 2693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '237', name: 'Tower Research Capital',            top: 1743, left: 3280, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '335', name: 'Pydantic',                          top: 1743, left: 4080, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '434', name: 'Red Hat',                           top: 1743, left: 4347, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '633', name: 'Reflex',                            top: 1858, left: 6418, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '732', name: 'Black Python Devs',                 top: 1867, left: 6693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '733', name: 'EuroPython Society',                top: 1867, left: 7449, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '134', name: 'PixelTable',                        top: 1992, left: 1991, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '135', name: 'TimeCopilot',                       top: 2009, left: 2427, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '234', name: 'Python Institute',                  top: 2009, left: 2693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '235', name: 'Elastic',                           top: 2009, left: 3280, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '334', name: 'Apify',                             top: 2009, left: 3556, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '531', name: 'Chainguard',                        top: 2125, left: 5644, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '630', name: 'Hex',                               top: 2134, left: 5929, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '730', name: 'CodeDay',                           top: 2134, left: 6693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '731', name: 'PyLadies',                          top: 2134, left: 7458, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '631', name: 'Auth0',                             top: 2143, left: 6418, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '126', name: 'Cloudflare',                        top: 2321, left: 1991, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '127', name: 'Hudson River Trading',              top: 2321, left: 2427, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '226', name: 'Kraken Tech',                       top: 2330, left: 2684, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '427', name: 'SerpApi',                           top: 2383, left: 4987, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '729', name: 'Python Asia Organization',          top: 2401, left: 7449, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '629', name: 'Temporal',                          top: 2410, left: 6409, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '728', name: 'SCaLE / Data Con LA',               top: 2410, left: 6693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '727', name: 'PyCon Africa / Seneg. / Mozambique',top: 2667, left: 7449, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '627', name: 'ReversingLabs',                     top: 2676, left: 6418, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '726', name: 'SoCal Python / Inland Empire PUG',  top: 2685, left: 6693, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '122', name: 'Sentry',                            top: 2845, left: 1991, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '621', name: 'Codespeed',                         top: 3032, left: 6400, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '421', name: 'JetBrains',                         top: 3041, left: 4987, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '720', name: 'QUBE Research & Technologies',      top: 3041, left: 6684, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '119', name: 'AWS',                               top: 3254, left: 2409, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '717', name: 'Posit, PBC',                        top: 3397, left: 7209, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '116', name: 'Cubist Systematic Strategies',      top: 3414, left: 1991, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '413', name: 'Meta',                              top: 3681, left: 4987, width: 500, height: 780, imgW: 8000, imgH: 5655 },
    { id: '613', name: 'Bloomberg',                         top: 3681, left: 6391, width: 500, height: 780, imgW: 8000, imgH: 5655 },
    { id: '213', name: 'GitHub',                            top: 3690, left: 3280, width: 500, height: 780, imgW: 8000, imgH: 5655 },
    { id: '513', name: 'Vercel',                            top: 3930, left: 5653, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '112', name: 'Jane Street',                       top: 3939, left: 1991, width: 250, height: 500, imgW: 8000, imgH: 5655 },
    { id: '313', name: 'Anaconda',                          top: 3939, left: 4018, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '113', name: 'Capital One',                       top: 3948, left: 2409, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '709', name: 'Python Packaging Ecosystem Survey', top: 4668, left: 7209, width: 250, height: 250, imgW: 8000, imgH: 5655 },
    { id: '407', name: 'PSF',                               top: 4677, left: 4978, width: 525, height: 525, imgW: 8000, imgH: 5655 },
    { id: '606', name: 'Attendee Lounge',                   top: 4686, left: 5502, width: 750, height: 525, imgW: 8000, imgH: 5655 },
    { id: '707', name: 'Codeflash',                         top: 4935, left: 7209, width: 250, height: 250, imgW: 8000, imgH: 5655 },
  ];

  constructor(
    private confData: ConferenceData,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.loadSponsors();
  }

  ngAfterViewInit() {
    // @ciag/ngx-pinch-zoom hardcodes defaultMaxScale=3 and only auto-derives
    // a higher cap when the first descendant is an <img> AND limitZoom is
    // the string "original image size". Our content is wrapped in a div so
    // the auto-detect path is never taken; passing a numeric limitZoom is
    // silently ignored. Reach into the underlying IvyPinch instance after
    // it's constructed and bump maxScale directly. Polled because the
    // instance is created during ngOnInit on the child component.
    const start = Date.now();
    const tick = () => {
      const inner = this.pinchZoomCmp?.pinchZoom;
      if (inner) {
        inner.maxScale = 25;
        return;
      }
      if (Date.now() - start < 2000) {
        setTimeout(tick, 50);
      }
    };
    tick();
  }

  loadSponsors(showLoader = false) {
    // Seed static fallbacks first so the API merge can override them when a
    // booth does come through as a sponsor; otherwise PSF/community booths
    // remain blank.
    for (const booth of this.booths) {
      if (!booth.logoUrl && this.STATIC_BOOTH_LOGOS[booth.id]) {
        booth.logoUrl = this.STATIC_BOOTH_LOGOS[booth.id];
      }
    }

    const apply = (sponsors: any) => {
      for (const list of Object.values(sponsors || {})) {
        for (const sponsor of list as any[]) {
          if (sponsor.booth_number == null) continue;
          const booth = this.booths.find(b => b.id === String(sponsor.booth_number));
          if (!booth) continue;
          booth.logoUrl = sponsor.logo_url;
          booth.level = sponsor.level;
          booth.description = sponsor.description;
          if (sponsor.name) booth.name = sponsor.name;
        }
      }
    };

    if (!showLoader) {
      this.confData.getSponsors().subscribe(apply);
      return;
    }
    this.loadingCtrl.create({ message: 'Fetching latest...', duration: 10000 }).then(loader => {
      loader.present();
      this.confData.getSponsors().subscribe((sponsors: any) => {
        apply(sponsors);
        setTimeout(() => loader.dismiss(), 100);
      });
    });
  }

  getBoothStyle(booth: BoothData): { [key: string]: string } {
    return {
      'top':    `calc(${booth.top}    / ${booth.imgH} * 100%)`,
      'left':   `calc(${booth.left}   / ${booth.imgW} * 100%)`,
      'width':  `calc(${booth.width}  / ${booth.imgW} * 100%)`,
      'height': `calc(${booth.height} / ${booth.imgH} * 100%)`,
    };
  }

  toggleSearch() {
    this.showSearchbar = !this.showSearchbar;
    if (!this.showSearchbar) {
      this.clearSearch();
    } else {
      setTimeout(() => this.searchBar?.setFocus(), 150);
    }
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = this.booths.filter(b =>
      b.name.toLowerCase().includes(q) || b.id.includes(q)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchbar = false;
    this.highlightedBoothId = null;
  }

  selectBooth(booth: BoothData) {
    this.searchResults = [];
    this.showSearchbar = false;
    this.searchQuery = '';
    this.highlightedBoothId = booth.id;
    this.selectedBooth = booth;
    setTimeout(() => {
      const el = document.getElementById('boothgroup-' + booth.id);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 100);
  }

  onBoothTap(booth: BoothData) {
    this.selectedBooth = booth;
    this.highlightedBoothId = booth.id;
  }

  // Mirror sponsors page slug logic so the popup can deep-link into the
  // existing sponsor detail page. Booths without a sponsor match (community
  // booths like SoCal Python) won't have a level set; the template hides the
  // link in that case.
  getSponsorSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}
