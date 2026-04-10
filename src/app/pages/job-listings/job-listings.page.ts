import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.page.html',
  styleUrls: ['./job-listings.page.scss'],
})
export class JobListingsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;
  allListings: any[] = [];
  listings: any[] = [];
  searchText: string = '';

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  processListings(raw: any[]): any[] {
    return raw.map(listing => {
      return {
        ...listing,
        roles: this.parseRoles(listing.description_html),
      };
    });
  }

  parseRoles(html: string): {title: string, url: string}[] {
    if (!html) return [];

    // Strip HTML tags to work with plain text
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

    // Try to extract "Role Title - URL" or "Role Title | URL" patterns
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const urls = html.match(urlRegex) || [];

    if (urls.length === 0) {
      // No URLs — just return the text as a single entry
      return text.length > 0 ? [{title: text, url: ''}] : [];
    }

    // Try splitting by URLs to find role names
    const roles: {title: string, url: string}[] = [];
    let remaining = text;

    for (const url of urls) {
      const idx = remaining.indexOf(url);
      if (idx >= 0) {
        const before = remaining.substring(0, idx).replace(/[-|–,]\s*$/, '').trim();
        if (before.length > 0) {
          // Might contain multiple roles separated by earlier URLs — take last chunk
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

    // If we couldn't parse anything meaningful, return the raw text as one block
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

  loadListings() {
    this.confData.getJobListings().subscribe((listings: any[]) => {
      if (listings.length > 0 || this.allListings.length === 0) {
        this.allListings = this.processListings(listings);
        this.filterListings();
        this.changeDetection.detectChanges();
      }
    });
  }

  doRefresh(event: any) {
    this.confData.invalidateCache();
    this.confData.getJobListings().subscribe({
      next: (listings: any[]) => {
        this.allListings = this.processListings(listings);
        this.filterListings();
        this.changeDetection.detectChanges();
      },
      complete: () => {
        event.target.complete();
      }
    });
  }

  filterListings() {
    if (!this.searchText.trim()) {
      this.listings = this.allListings;
      return;
    }
    const words = this.searchText.toLowerCase().replace(/,|\.|-/g, ' ').split(' ').filter(w => w.trim().length);
    this.listings = this.allListings.filter(listing => {
      const haystack = `${listing.sponsor_name || ''} ${listing.description_html || ''} ${listing.roles?.map(r => r.title).join(' ') || ''}`.toLowerCase();
      return words.every(word => haystack.includes(word));
    });
  }

  resetSearch() {
    this.searchText = '';
    this.listings = this.allListings;
  }

  openUrl(url: string) {
    if (url) {
      window.open(url, '_system', 'location=yes');
    }
  }

  ngOnInit() {
    this.loadListings();
  }
}
