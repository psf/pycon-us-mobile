import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'page-sponsor-detail',
  templateUrl: 'sponsor-detail.html',
  styleUrls: ['./sponsor-detail.scss'],
})
export class SponsorDetailPage {
  sponsor: any;
  jobListings: any[] = [];
  backHref = '';

  constructor(
    private dataProvider: ConferenceData,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public liveUpdateService: LiveUpdateService,
  ) {}

  // Imperative navigation to /app/tabs/expo-hall?booth=<id>. We don't use
  // routerLink here because the booth pill targets a different Ionic tab
  // (sponsors → expo-hall), and Ionic's tab outlet keys its cache on the
  // path segment alone — so jumping from ?booth=613 to ?booth=127 looks
  // like "same tab, restore cached page" and the new query param never
  // reaches the map. NavController.navigateRoot forces a fresh activation.
  goToBooth(boothNumber: string | number | null | undefined) {
    if (boothNumber == null || boothNumber === '') return;
    this.navCtrl.navigateRoot(['/app/tabs/expo-hall'], {
      queryParams: { booth: String(boothNumber) },
    });
  }

  ionViewDidEnter() {
    this.backHref = this.route.snapshot.queryParamMap.get('prevUrl') || '/app/tabs/sponsors';
  }

  ionViewWillEnter() {
    const sponsorId = this.route.snapshot.paramMap.get('sponsorId');

    // CRITICAL: reset sponsor + jobListings on every entry. Ionic + Angular's
    // IonicRouteStrategy reuses this component instance across different
    // :sponsorId values (the routeConfig is identical), so class fields
    // persist from the previous sponsor. The old `if (this.sponsor) break`
    // outer-loop guard would short-circuit on a stale match from the prior
    // sponsor — if the new sponsor's level was iterated AFTER the previous
    // sponsor's level, we'd never reach it and the page would render the
    // OLD sponsor's data (logo, name, AND booth number). Tapping the booth
    // pill then navigates to the wrong booth.
    this.sponsor = undefined;
    this.jobListings = [];

    this.dataProvider.load().subscribe((data: any) => {
      let found: any = null;
      if (data && data.conference && data.conference.sponsors) {
        outer: for (const sponsors of Object.values(data.conference.sponsors)) {
          for (const sponsor of sponsors as any[]) {
            if (sponsor && this.getSponsorSlug(String(sponsor.name)) === sponsorId) {
              found = sponsor;
              break outer;
            }
          }
        }
      }
      this.sponsor = found;

      // Find job listings associated with this sponsor
      const listings = data['job-listings'] || [];
      if (this.sponsor) {
        this.jobListings = listings.filter(
          (listing: any) => listing.sponsor_name === this.sponsor.name
        ).map((listing: any) => ({
          ...listing,
          roles: this.parseRoles(listing.description_html),
        }));
      }
    });
  }

  parseRoles(html: string): {title: string, url: string}[] {
    if (!html) return [];
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const urls = html.match(urlRegex) || [];
    if (urls.length === 0) {
      return text.length > 0 ? [{title: text, url: ''}] : [];
    }
    const roles: {title: string, url: string}[] = [];
    let remaining = text;
    for (const url of urls) {
      const idx = remaining.indexOf(url);
      if (idx >= 0) {
        const before = remaining.substring(0, idx).replace(/[-|–,]\s*$/, '').trim();
        if (before.length > 0) {
          const lines = before.split(/\n/).filter(l => l.trim());
          const title = lines[lines.length - 1].replace(/^[-|–]\s*/, '').trim();
          if (title.length > 0 && title.length < 200) {
            roles.push({title, url});
          } else {
            roles.push({title: this.shortenUrl(url), url});
          }
        } else {
          roles.push({title: this.shortenUrl(url), url});
        }
        remaining = remaining.substring(idx + url.length).replace(/^\s*[-|–,]\s*/, '').trim();
      }
    }
    if (roles.length === 0 && text.length > 0) {
      return [{title: text, url: ''}];
    }
    return roles;
  }

  shortenUrl(url: string): string {
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/\/$/, '');
      const parts = path.split('/').filter(p => p);
      if (parts.length > 0) {
        return parts[parts.length - 1].replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
      }
      return u.hostname;
    } catch {
      return url;
    }
  }

  openUrl(url: string) {
    if (url) {
      window.open(url, '_system', 'location=yes');
    }
  }

  getSponsorSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
}
