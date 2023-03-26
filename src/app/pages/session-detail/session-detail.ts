import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';

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
    private route: ActivatedRoute
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

  shareSession() {
    console.log('Clicked share session');
  }
}
