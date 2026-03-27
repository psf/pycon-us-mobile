import { Component } from '@angular/core';
import { InAppBrowser, DefaultWebViewOptions } from '@capacitor/inappbrowser';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { LiveUpdateService } from '../../providers/live-update.service';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    public liveUpdateService: LiveUpdateService,
    private location: Location,
  ) { }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (data.sessions) {
        const sessionId = this.route.snapshot.paramMap.get('sessionId');
        const foundSession = data.sessions.find(
          (s: any) => String(s.id) === String(sessionId)
        )
        this.session = foundSession

        this.isFavorite = this.userProvider.hasFavorite(
          String(this.session.id)
        );
      }
    });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.userProvider.hasFavorite(String(this.session.id))) {
      this.userProvider.removeFavorite(String(this.session.id));
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(String(this.session.id));
      this.isFavorite = true;
    }
  }

  onDescriptionClick(event: Event) {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a') as HTMLAnchorElement;
    if (anchor) {
      event.preventDefault();
      let href = anchor.getAttribute('href');
      if (href) {
        // Resolve relative URLs against us.pycon.org
        if (href.startsWith('/')) {
          href = environment.baseUrl + href;
        }
        InAppBrowser.openInWebView({ url: href, options: DefaultWebViewOptions });
      }
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
}
