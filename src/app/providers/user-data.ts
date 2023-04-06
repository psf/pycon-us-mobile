import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { PyConAPI } from '../providers/pycon-api';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_LEAD_RETRIEVAL = 'hasLeadRetrieval';

  constructor(
    public storage: Storage,
    private pycon: PyConAPI,
  ) {
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;
    });
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
            this.storage.set('favorite_sessions', userPrefs.favorites).then(() => {});
          }
        })
      })
    })
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
    });
    this.favorites.push(String(sessionId));
    this.pycon.patchUserData({favorites: this.favorites});
    this.storage.set('favorite_sessions', this.favorites).then(() => {});
  }

  removeFavorite(sessionId: string): void {
    this.storage.get('favorite_sessions').then((data) => {
      this.favorites = (data === null)? [] : data;
    });
    const index = this.favorites.indexOf(String(sessionId));
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.pycon.patchUserData({favorites: this.favorites});
    this.storage.set('favorite_sessions', this.favorites).then(() => {});
  }

  login(data: any): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.fetchPreferences();
      this.setNickname(data.nickname);
      this.setEmail(data.email);
      this.setAuthKey(data.key);
      this.setSecret(data.secret);
      this.setHasLeadRetrieval(data.features?.lead_retrieval);
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
}
