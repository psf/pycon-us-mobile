import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

import { PyConAPI } from '../providers/pycon-api';


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

  // Get current theme from storage
  getDarkTheme() {
    return this.storage.get('darkTheme');
  }

  // Toggle Dark Theme. Sets inverted value to storage
  toggleDarkTheme() {
    this.getDarkTheme().then((darkTheme) => {
      this.storage.set('darkTheme', !darkTheme);
    });
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

  getScheduleFilters(): Promise<Array<string>> {
    return this.storage.get('scheduleFilters').then((value) => {
      // If there are none, return an empty array
      return value || [];
    });
  }

  setScheduleFilters(filters: any) {
    this.storage.set('scheduleFilters', filters);
  }
}
