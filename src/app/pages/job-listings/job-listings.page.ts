import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.page.html',
  styleUrls: ['./job-listings.page.scss'],
})
export class JobListingsPage implements OnInit {
  allListings: any[] = [];
  listings: any[] = [];
  searchText: string = '';

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    public liveUpdateService: LiveUpdateService,
  ) {}

  loadListings() {
    this.confData.getJobListings().subscribe((listings: any[]) => {
      if (listings.length > 0 || this.allListings.length === 0) {
        this.allListings = listings;
        this.filterListings();
        this.changeDetection.detectChanges();
      }
    });
  }

  doRefresh(event: any) {
    this.confData.invalidateCache();
    this.confData.getJobListings().subscribe({
      next: (listings: any[]) => {
        this.allListings = listings;
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
      const haystack = `${listing.sponsor_name || ''} ${listing.description_html || ''}`.toLowerCase();
      return words.every(word => haystack.includes(word));
    });
  }

  resetSearch() {
    this.searchText = '';
    this.listings = this.allListings;
  }

  ngOnInit() {
    this.loadListings();
  }
}
