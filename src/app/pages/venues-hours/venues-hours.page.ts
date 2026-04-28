import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';
import { VENUE_LOCATIONS, VenueLocation } from '../../location-map/venue-locations';

interface VenueSection {
  html: SafeHtml;
  location?: VenueLocation;
}

@Component({
  selector: 'app-venues-hours',
  templateUrl: './venues-hours.page.html',
  styleUrls: ['./venues-hours.page.scss'],
})
export class VenuesHoursPage implements OnInit {
  @ViewChild(IonContent) ionContent: IonContent;
  content: any = '';
  showTitle = false;
  sections: VenueSection[] = [];

  constructor(
    private confData: ConferenceData,
    private changeDetection: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }

  ngOnInit() {
    this.confData.getContent().subscribe((content: any) => {
      this.content = content;
      this.sections = this.buildSections(content?.['venues-hours'] || '');
      this.changeDetection.detectChanges();
    });
  }

  private buildSections(html: string): VenueSection[] {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="root">${html}</div>`, 'text/html');
    const root = doc.getElementById('root');
    if (!root) {
      return [{ html: this.sanitizer.bypassSecurityTrustHtml(html) }];
    }

    const sections: VenueSection[] = [];
    let current = document.createElement('div');

    const flush = () => {
      if (current.innerHTML.trim()) {
        const heading = current.querySelector('h1, h2, h3, h4, h5, h6');
        const text = (heading?.textContent || '').toLowerCase();
        sections.push({
          html: this.sanitizer.bypassSecurityTrustHtml(current.innerHTML),
          location: this.matchLocation(text),
        });
      }
    };

    const isSectionHeading = (node: Node): boolean => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const tag = (node as Element).tagName;
      return tag === 'H1' || tag === 'H2' || tag === 'H3';
    };

    Array.from(root.childNodes).forEach((node) => {
      if (isSectionHeading(node)) {
        flush();
        current = document.createElement('div');
      }
      current.appendChild(node.cloneNode(true));
    });
    flush();

    return sections;
  }

  private matchLocation(headingText: string): VenueLocation | undefined {
    if (!headingText) return undefined;
    if (headingText.includes('information desk') || headingText.includes('info desk')) {
      return VENUE_LOCATIONS['infoDesk'];
    }
    if (headingText.includes('registration')) {
      return VENUE_LOCATIONS['registration'];
    }
    if (headingText.includes('swag pickup') || headingText.includes('t-shirt')) {
      return VENUE_LOCATIONS['swagPickup'];
    }
    if (headingText.includes('quiet room')) {
      return VENUE_LOCATIONS['quietRoom'];
    }
    if (headingText.includes('lost') && headingText.includes('found')) {
      return VENUE_LOCATIONS['lostAndFound'];
    }
    return undefined;
  }
}
