import { Component } from '@angular/core';
import { InAppBrowser, DefaultWebViewOptions } from '@capacitor/inappbrowser';
import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
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
  isOpenSpace = false;
  isKeynote = false;
  keynoteData: any[] = [];
  defaultHref = '';

  private keynoteSpeakers: Record<string, any> = {
    'Lin Qiao': {
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/lin_qiao.original.jpg',
      bio: 'Lin Qiao is the CEO and co-founder of global AI inference cloud and infrastructure platform Fireworks AI, enables teams like Cursor, Uber, DoorDash, and Shopify to build, tune, and scale highly optimized generative AI applications. Prior to founding Fireworks, Lin was the co-creator and head of Meta\'s PyTorch.',
    },
    'amanda casari': {
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/amcasari-headshot.original.png',
      bio: 'amanda casari is an engineer and researcher who has worked in many technical and socio-technical disciplines for over 20 years, including developer relations, product management, data science, and underwater robotics.',
    },
    'Tim Schilling': {
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Tim_Schilling.original.jpg',
      bio: 'A software engineer that loves Django and our community. On the Django Steering Council, a cofounder of Djangonaut Space and an admin of Django Commons.',
    },
    'Rachell Calhoun': {
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/rachell_calhoun.original.jpg',
      bio: 'Co-founder of Djangonaut Space and a Django developer. Organized Django Girls workshops across multiple countries and continents for over 10 years.',
    },
    'Pablo Galindo Salgado': {
      photo: 'https://pycon-assets.s3.amazonaws.com/2026/media/images/Pablo_Galindo_Salgado.original.jpg',
      bio: 'CPython core developer and Theoretical Physicist. Currently serving on the Python Steering Council in his 6th term and release manager for Python 3.10 and 3.11.',
    },
  };

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
        this.session = foundSession;
        this.isOpenSpace = this.session?.tracks?.includes('open-space');
        this.isKeynote = this.session?.tracks?.includes('keynote') || this.session?.track === 'Keynote';

        // Enrich keynote sessions with speaker photo/bio. Collect every
        // matching speaker so co-hosted keynotes (e.g. "Rachell Calhoun &
        // Tim Schilling") render all speakers, not just the first match.
        if (this.isKeynote) {
          const sessionName = (this.session?.name || '').toLowerCase();
          this.keynoteData = Object.entries(this.keynoteSpeakers)
            .filter(([name]) => sessionName.includes(name.toLowerCase()))
            .map(([name, data]) => ({ name, ...data }));
        }

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

  async addToCalendar() {
    if (!this.session) return;

    await CapacitorCalendar.requestWriteOnlyCalendarAccess();

    const speakers = this.session.speakers?.map((s: any) => s.name).join(', ') || '';
    const description = speakers ? `Speakers: ${speakers}` : '';

    await CapacitorCalendar.createEventWithPrompt({
      title: this.session.name,
      location: this.session.location || '',
      description,
      startDate: new Date(this.session.startUtc).getTime(),
      endDate: new Date(this.session.endUtc).getTime(),
      isAllDay: false,
      url: environment.baseUrl + '/2026/schedule/presentation/' + this.session.id + '/',
    });
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
