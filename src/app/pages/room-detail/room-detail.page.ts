import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';
import { ConferenceData } from '../../providers/conference-data';
import { getRoomLocation } from '../../location-map/room-locations';
import { VenueLocation } from '../../location-map/venue-locations';

interface RoomDay {
  day: string;
  sessions: any[];
}

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.page.html',
  styleUrls: ['./room-detail.page.scss'],
})
export class RoomDetailPage implements OnInit, OnDestroy {
  room: any = null;
  days: RoomDay[] = [];
  loaded = false;
  highlightSessionId: any = null;
  showTitle = false;
  roomLocation: VenueLocation | null = null;

  private paramSub?: Subscription;
  private dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private confData: ConferenceData,
  ) {}

  ngOnInit() {
    this.paramSub = combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, query]) => {
        const slug = params.get('roomSlug');
        this.highlightSessionId = query.get('session');
        this.loadRoom(slug);
      },
    );
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

  private loadRoom(slug: string | null) {
    if (!slug) return;
    this.confData.getRoom(slug).subscribe((room: any) => {
      this.loaded = true;
      this.room = room || null;
      this.days = room ? this.groupByDay(room.sessions) : [];
      this.roomLocation = room ? getRoomLocation(room.name) : null;
      if (this.highlightSessionId) {
        this.scrollToSession(this.highlightSessionId);
      }
    });
  }

  private scrollToSession(sessionId: any) {
    setTimeout(() => {
      const el = document.getElementById('room-session-' + sessionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  private groupByDay(sessions: any[]): RoomDay[] {
    const map = new Map<string, any[]>();
    sessions.forEach((s: any) => {
      const day = s.day || 'TBD';
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(s);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        const ai = this.dayOrder.indexOf(a);
        const bi = this.dayOrder.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
      .map(([day, daySessions]) => ({ day, sessions: daySessions }));
  }

  sessionRoute(session: any) {
    if (typeof session.id === 'string' && session.id.startsWith('poster-detail-')) {
      return ['/app/tabs/schedule/session', session.id];
    }
    return ['/app/tabs/schedule/session', session.id];
  }
}
