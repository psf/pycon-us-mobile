import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_LEAD_RETRIEVAL = 'hasLeadRetrieval';

  constructor(
    public storage: Storage
  ) { }

  hasFavorite(sessionId: string): boolean {
    return (this.favorites.indexOf(sessionId) > -1);
  }

  addFavorite(sessionId: string): void {
    this.favorites.push(sessionId);
  }

  removeFavorite(sessionId: string): void {
    const index = this.favorites.indexOf(sessionId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  login(data: any): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setNickname(data.nickname);
      this.setEmail(data.email);
      this.setAuthKey(data.key);
      this.setSecret(data.secret);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  signup(email: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setEmail(email);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('email');
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

  checkHasLeadRetrieval(): Promise<boolean> {
    return this.storage.get(this.HAS_LEAD_RETRIEVAL).then((value) => {
      return this.isLoggedIn();
    });
  }
}
