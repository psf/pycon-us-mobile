import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

import { PyConAPI } from '../providers/pycon-api';

// Default schedule filter: Open Spaces are conference-day-only and clutter
// the timeline before then, so first-time users see them excluded.
export const DEFAULT_EXCLUDED_TRACKS: ReadonlyArray<string> = ['Open Space'];

export function isCustomScheduleFilter(excluded: ReadonlyArray<string>): boolean {
  if (excluded.length !== DEFAULT_EXCLUDED_TRACKS.length) return true;
  const defaults = new Set(DEFAULT_EXCLUDED_TRACKS);
  return !excluded.every(track => defaults.has(track));
}

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'high-contrast-light'
  | 'high-contrast-dark';
export const THEME_MODES: ThemeMode[] = [
  'light',
  'dark',
  'high-contrast-light',
  'high-contrast-dark',
];

@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  // Intialize our RxJS subject to know when the favorites have changed
  // BehaviorSubject may be more appropriate here?
  private favoritesSubject = new Subject<void>();
  favoritesChanged$ = this.favoritesSubject.asObservable();
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_LEAD_RETRIEVAL = 'hasLeadRetrieval';
  HAS_DOOR_CHECK = 'hasDoorCheck';
  HAS_MASK_VIOLATION = 'hasMaskViolation';
  IS_SPEAKER = 'isSpeaker';
  HAS_SCANNER_CONSENT = 'hasScannerConsent';

  constructor(
    public storage: Storage,
    private pycon: PyConAPI,
  ) {
    this.storage.create();
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;
    });
  }

  fetchFeatures() {
    this.isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        return
      }
      this.pycon.fetchFeatures().then(data => {
        data.subscribe(data => {
            this.setHasLeadRetrieval(data.features?.lead_retrieval);
            this.setHasDoorCheck(data.features?.door_check_in);
            this.setHasMaskViolation(data.features?.mask_violation);
        })
      })
    })
  }

  fetchPreferences() {
    this.isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        return
      }
      this.pycon.fetchPreferences().then(data => {
        data.subscribe(userPrefs => {
          console.log(userPrefs);
          if (userPrefs?.favorites) {
            console.log(userPrefs)
            this.favorites = userPrefs.favorites;
            this.storage.set('favorite_sessions', userPrefs.favorites).then(() => {
              this.favoritesSubject.next();
            });
          }
        })
      })
    })
  }

  // Resolve the active theme. Migrates legacy storage shapes:
  //   darkTheme: true        -> 'dark'           (pre-tri-state picker)
  //   theme: 'high-contrast' -> 'high-contrast-dark'  (pre-HC-light split)
  async getTheme(): Promise<ThemeMode> {
    const stored = await this.storage.get('theme');
    if (stored === 'high-contrast') {
      await this.storage.set('theme', 'high-contrast-dark');
      return 'high-contrast-dark';
    }
    if (stored && THEME_MODES.indexOf(stored) !== -1) {
      return stored;
    }
    const legacyDark = await this.storage.get('darkTheme');
    if (legacyDark === true) {
      await this.storage.set('theme', 'dark');
      await this.storage.remove('darkTheme');
      return 'dark';
    }
    if (legacyDark === false) {
      await this.storage.remove('darkTheme');
    }
    return 'light';
  }

  setTheme(theme: ThemeMode): Promise<any> {
    return this.storage.set('theme', theme);
  }

  hasFavorite(sessionId: string): boolean {
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;
    });
    return (this.favorites.indexOf(String(sessionId)) > -1);
  }

  addFavorite(sessionId: string): void {
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;

      if (this.favorites.indexOf(String(sessionId)) === -1) {
        this.favorites.push(String(sessionId));
        this.isLoggedIn().then((loggedIn) => {
          if (loggedIn) {
            this.pycon.patchUserData({favorites: this.favorites});
          }
        });
        this.storage.set('favorite_sessions', this.favorites).then(() => {
          this.favoritesSubject.next();
        });
      }
    });
  }

  async addFavorites(sessionIds: string[]): Promise<void> {
    const data = await this.storage.get('favorite_sessions');
    this.favorites = (data === null) ? [] : data;

    const ids = sessionIds.map(String);
    const newIds = ids.filter(id => this.favorites.indexOf(id) === -1);
    if (newIds.length === 0) return;

    this.favorites.push(...newIds);
    await this.storage.set('favorite_sessions', this.favorites);
    this.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        this.pycon.patchUserData({ favorites: this.favorites });
      }
    });
    this.favoritesSubject.next();
  }

  removeFavorite(sessionId: string): void {
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;

      const index = this.favorites.indexOf(String(sessionId));
      if (index > -1) {
        this.favorites.splice(index, 1);

        this.storage.set('favorite_sessions', this.favorites).then(() => {
          this.isLoggedIn().then((loggedIn) => {
            if (loggedIn) {
              this.pycon.patchUserData({favorites: this.favorites});
            }
          });
          this.favoritesSubject.next();
        });
      }
    });
  }

  login(data: any): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.fetchPreferences();
      this.setNickname(data.nickname);
      this.setEmail(data.email);
      this.setAuthKey(data.key);
      this.setSecret(data.secret);
      this.setHasLeadRetrieval(data.features?.lead_retrieval);
      this.setHasDoorCheck(data.features?.door_check_in);
      this.setHasMaskViolation(data.features?.mask_violation);
      this.setIsSpeaker(data.features?.is_speaker);
    }).then(() => {
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      this.storage.remove('favorite_sessions');
      this.storage.remove('email');
      this.storage.remove('nickname');
      this.storage.remove('key');
      this.storage.remove('secret');
      this.storage.remove(this.HAS_LEAD_RETRIEVAL);
      this.storage.remove(this.HAS_DOOR_CHECK);
      this.storage.remove(this.HAS_MASK_VIOLATION);
      this.storage.remove(this.IS_SPEAKER);
      this.storage.remove(this.HAS_SCANNER_CONSENT);
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setEmail(email: string): Promise<any> {
    return this.storage.set('email', email);
  }

  getEmail(): Promise<string> {
    return this.storage.get('email').then((value) => {
      return value;
    });
  }

  setNickname(nickname: string): Promise<any> {
    return this.storage.set('nickname', nickname);
  }

  getNickname(): Promise<string> {
    return this.storage.get('nickname').then((value) => {
      return value;
    });
  }

  setAuthKey(key: string): Promise<any> {
    return this.storage.set('key', key);
  }

  getAuthKey(): Promise<string> {
    return this.storage.get('key').then((value) => {
      return value;
    });
  }

  setSecret(secret: string): Promise<any> {
    return this.storage.set('secret', secret);
  }

  getSecret(): Promise<string> {
    return this.storage.get('secret').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }

  setHasLeadRetrieval(value: boolean): Promise<any> {
    return this.storage.set(this.HAS_LEAD_RETRIEVAL, value);
  }

  checkHasLeadRetrieval(): Promise<boolean> {
    return this.storage.get(this.HAS_LEAD_RETRIEVAL).then((value) => {
      return value;
    });
  }

  setHasDoorCheck(value: boolean): Promise<any> {
    return this.storage.set(this.HAS_DOOR_CHECK, value);
  }

  checkHasDoorCheck(): Promise<boolean> {
    return this.storage.get(this.HAS_DOOR_CHECK).then((value) => {
      return value;
    });
  }

  setHasMaskViolation(value: boolean): Promise<any> {
    return this.storage.set(this.HAS_MASK_VIOLATION, value);
  }

  checkHasMaskViolation(): Promise<boolean> {
    return this.storage.get(this.HAS_MASK_VIOLATION).then((value) => {
      return value;
    });
  }

  setScannerConsent(value: boolean): Promise<any> {
    return this.storage.set(this.HAS_SCANNER_CONSENT, value);
  }

  checkScannerConsent(): Promise<boolean> {
    return this.storage.get(this.HAS_SCANNER_CONSENT).then((value) => {
      return value === true;
    });
  }

  setIsSpeaker(value: boolean): Promise<any> {
    return this.storage.set(this.IS_SPEAKER, value);
  }

  checkIsSpeaker(): Promise<boolean> {
    return this.storage.get(this.IS_SPEAKER).then((value) => {
      return value;
    });
  }

  getScheduleFilters(): Promise<Array<string>> {
    return this.storage.get('scheduleFilters').then((value) => {
      // First-time users get the app default. Anyone who has explicitly
      // toggled the filter — even to clear all exclusions, stored as `[]` —
      // keeps their preference.
      if (value === null || value === undefined) {
        return [...DEFAULT_EXCLUDED_TRACKS];
      }
      return value;
    });
  }

  setScheduleFilters(filters: any) {
    this.storage.set('scheduleFilters', filters);
  }
}
