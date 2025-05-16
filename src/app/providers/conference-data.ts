import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, timeout, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import markdownToTxt from 'markdown-to-txt';

import { UserData } from './user-data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConferenceData {
  data: any;
  slotColors: any = {
    plenary: 'primary',
    poster: 'tertiary',
    event: 'light',
    summit: 'light',
    break: 'light',
    informational: 'medium',
    openSpace: 'light',
  };

  constructor(
    public http: HttpClient,
    public user: UserData,
    public storage: Storage,
    private toastController: ToastController,
  ) {
    this.storage.create();
  }

  async presentMessage(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      icon: 'exclamation'
    });
    toast.present();
  }

  load(): any {
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get(`${environment.baseUrl}/2025/schedule/conference.json`)
        .pipe(timeout(10000), catchError(error => {
          console.log('Unable to load latest from remote, ' + error)
          return this.storage.get('schedule-cache').then((data) => {
            if (data !== null) {
              return of(data);
            }
            throw new Error('No offline cache available!');
          }).catch((error) => {
            this.presentMessage('Unable to load schedule, no offline cache available');
          });
        }))
        .pipe(map(this.processData, this));
    }
  }

  processData(data: any) {
    this.storage.set('schedule-cache', data);

    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = {
      "schedule": [],
      "speakers": [],
      "tracks": ["open-spaces"],
      "sessions": [],
      "conference": data.conference,
      "open-spaces": [],
    };

    data['open-spaces'].forEach((openSpace: any) => {
      var start = new Date(openSpace.start);
      var end = new Date(openSpace.end);
      var session = {
        "name": openSpace.title,
        "color": 'light',
        "preRegistered": false,
        "listRender": true,
        "section": "open-spaces",
        "location": openSpace.room_display,
        "description": openSpace.description,
        "speakers": [],
        "speakerNames": [],
        "timeStart": start.toLocaleTimeString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
        "timeEnd": end.toLocaleString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
        "track": "Open Space",
        "tracks": ["open-space"],
        "id": openSpace.conf_key,
        "day": start.toLocaleDateString('en-us', {timeZone: "EST5EDT", weekday: 'short'})
      }
      this.data.sessions.push(session);
    });

    data.schedule.forEach((slot: any) => {
      if (["blank"].includes(slot.kind)) {
        return;
      }
      if (slot.name == "Slot") {
        return;
      }
      if (slot.kind == "sponsor-workshop") {
        slot.kind = "Sponsor Presentation"
      }

      if (slot.speakers) {
        slot.speakers.forEach((speaker: any) => {
          const speakerExists = this.data.speakers.find(
            (s: any) => s.id === speaker.id
          )
          if (!(speakerExists)){
            this.data.speakers.push({
              "id": speaker.id,
              "name": speaker.name,
              // only display the speaker photo if it's not null in the response.
              // otherwise, show a default fallback photo
              "profilePic": speaker.photo ? speaker.photo : 'assets/img/person-circle-outline.png',
              "about": speaker.bio,
            });
          }
        });
      }

      // transform any markdown slot names to regular text
      slot.name = markdownToTxt(slot.name);
      slot.preRegistered = (slot.name.includes('pre-registration') || slot.kind === "tutorial")? true : false;
      if (slot.preRegistered) {
        slot.name = slot.name.split(', pre-registration')[0];
      }

      var start = new Date(slot.start);
      var end = new Date(slot.end);
      var session = {
          "name": slot.name,
          "color": this.slotColors[slot.kind],
          "preRegistered": slot.preRegistered,
          "listRender": slot.list_render,
          "section": slot.section,
          "location": slot.room,
          "description": slot.description,
          "speakers": [],
          "speakerNames": slot.authors,
          "timeStart": start.toLocaleTimeString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
          "timeEnd": end.toLocaleString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
          "track": slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1),
          "tracks": [slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1)],
          "id": slot.conf_key,
          "day": start.toLocaleDateString('en-us', {timeZone: "EST5EDT", weekday: 'short'})
      }

      const track = this.data.tracks.find(
        (t: any) => t.name === slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1)
      )
      if (!(track)) {
        this.data.tracks.push({"name": slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1), "icon": "mic-outline"})
      }

      if (slot.speakers) {
        session.speakerNames.forEach((speakerName: any) => {
          const speaker = this.data.speakers.find(
            (s: any) => s.name === speakerName
          );
          if (speaker) {
            session.speakers.push(speaker);
            speaker.sessions = speaker.sessions || [];
            speaker.sessions.push(session);
          }
        });
      }

      if (!slot.sessions) {
        this.data.sessions.push(session);
      }

      if (slot.sessions) {
        slot.sessions.forEach((shared_session, index, arr) => {
          if (shared_session.speakers) {
            shared_session.speakers.forEach((speaker: any) => {
              const speakerExists = this.data.speakers.find(
                (s: any) => s.id === speaker.id
              )
              if (!(speakerExists)){
                this.data.speakers.push({
                  "id": speaker.id,
                  "name": speaker.name,
                  // only display the speaker photo if it's not null in the response.
                  // otherwise, show a default fallback photo
                  "profilePic": speaker.photo ? speaker.photo : 'assets/img/person-circle-outline.png',
                  "about": speaker.bio,
                });
              }
            });
          }

          // transform any markdown shared_session names to regular text
          shared_session.name = markdownToTxt(shared_session.name);

          var start = new Date(slot.start);
          var end = new Date(slot.end);
          var session = {
              "name": shared_session.name,
              "location": slot.room,
              "description": shared_session.description,
              "speakers": [],
              "speakerNames": shared_session.authors,
              "timeStart": start.toLocaleTimeString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
              "timeEnd": end.toLocaleString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase(),
              "trackSlug": slot.kind + 's',
              "track": slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1),
              "tracks": [slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1)],
              "id": shared_session.conf_key,
              "day": start.toLocaleDateString('en-us', {timeZone: "EST5EDT", weekday: 'short'})
          }

          const track = this.data.tracks.find(
            (t: any) => t.name === slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1)
          )
          if (!(track)) {
            this.data.tracks.push({"name": slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1), "icon": "mic-outline"})
          }

          if (shared_session.speakers) {
            session.speakerNames.forEach((speakerName: any) => {
              const speaker = this.data.speakers.find(
                (s: any) => s.name === speakerName
              );
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          this.data.sessions.push(session);
        })
      }

      const offset = -4; // Hardcode offset for Eastern
      var estDate= new Date(start.getTime() + (offset*3600*1000))
      var day = estDate.toISOString().split('T')[0];
      var group = start.toLocaleTimeString([], {timeZone: "EST5EDT", hour: 'numeric', minute:'2-digit'}).toLowerCase();

      const scheduleDay = this.data.schedule.find(
        (d: any) => d.date === day
      );
      if (scheduleDay) {
        const scheduleDayGroup = scheduleDay.groups.find(
          (g: any) => g.time === group
        );
        if (scheduleDayGroup) {
            scheduleDayGroup.sessions.push(session)
	} else {
            scheduleDay.groups.push({"time": group, "sessions": [session], "startTime": start})
        }
      } else {
        this.data.schedule.push({"date": day, "groups": [{"time": group, "sessions": [session]}]})
      }

    });

    return this.data;
  }

  getDays(
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    return this.load().pipe(
      map((data: any) => {
        const days = []
        var index = 0;
        data.schedule.sort(function(a, b){var x = a.date; var y = b.date; return ((x < y) ? -1 : ((x > y) ? 1 : 0));}).forEach((day: any) => {
          var dateObj = new Date(day.date+"T00:00:00.000-12:00");
          days.push({"index": index.toString(), "date": day.date, "day": dateObj.toLocaleDateString('en-us', {timeZone: "EST5EDT", weekday: 'short'})});
          index += 1;
        })
        return days;
      })
    );
  }

  getTimeline(
    dayIndex: string,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    return this.load().pipe(
      map((data: any) => {
        const day = data.schedule.sort(function(a, b){var x = a.date; var y = b.date; return ((x < y) ? -1 : ((x > y) ? 1 : 0));})[dayIndex];
        day.shownSessions = 0;

        queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

        day.groups.forEach((group: any) => {
          group.hide = true;

          group.sessions.forEach((session: any) => {
            // check if this session should show or not
            this.filterSession(session, queryWords, excludeTracks, segment);

            if (!session.hide) {
              // if this session is not hidden then this group should show
              group.hide = false;
              day.shownSessions++;
            }
          });
        });

        return day;
      })
    );
  }

  getSessions(
    queryText = '',
    excludeTracks: any[] = [],
  ) {
    return this.load().pipe(
      map((data: any) => {
        const sessions = []

        queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
        const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

        data.sessions.forEach((session: any) => {
          // check if this session should show or not
          this.filterSession(session, queryWords, excludeTracks, 'all');
          if (!session.hide) {
            sessions.push(session);
          }
        });

        if (sessions.length > 0 && sessions[0].track === "Open Space") {
          const dayPriority = { "Fri": 0, "Sat": 1, "Sun": 2 };
          sessions.sort((a, b) => {
            const dayDiff = (dayPriority[a.day] || 0) - (dayPriority[b.day] || 0);
            return dayDiff || this.parseTime(a.timeStart) - this.parseTime(b.timeStart);
          });
        }

        return sessions;
      })
    );
  }

  parseTime(timeString) {
    const [time, period] = timeString.trim().toLowerCase().split(/([ap]m)/);
    let [hours, minutes] = time.split(':').map(Number);
    if ((period||'').includes('p') && hours < 12) {
      hours += 12;
    } else if ((period||'').includes('a') && hours === 12) {
             hours = 0;
           }
    return hours * 60 + (minutes || 0);
  }

  filterSession(
    session: any,
    queryWords: string[],
    excludeTracks: any[],
    segment: string
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
        if (session.description) {
          if (session.description.toLowerCase().indexOf(queryWord) > -1) {
            matchesQueryText = true;
          }
        }
        session.speakers.forEach((speaker: any) => {
          if (speaker.name.toLowerCase().indexOf(queryWord) > -1) {
            matchesQueryText = true;
          }
        });
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.tracks.forEach((trackName: string) => {
      if (excludeTracks.indexOf(trackName) === -1) {
        matchesTracks = true;
      }
    });

    // if the segment is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (this.user.hasFavorite(session.id)) {
      session.favorite = true;
    } else {
      session.favorite = false;
    }
    if (segment === 'favorites') {
      if (session.favorite) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSponsors() {
    return this.load().pipe(
      map((data: any) => {
        return data.conference.sponsors;
      })
    );
  }

  getContent() {
    return this.load().pipe(
      map((data: any) => {
        return data.conference.content;
      })
    );
  }

  querySponsors(queryText: string) {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    return this.load().pipe(
      map((data: any) => {
        const results = [];
        for (const [level, sponsorss] of Object.entries(data.conference.sponsors)) {
          for(const [index, sponsor] of Object.entries(sponsorss)) {
            if (this.filterSponsors(sponsor, queryWords)) {
              if (sponsor.booth_number !== null) {
                results.push(sponsor);
              }
            }
          }
        }
        return results;
      })
    );
  }


  filterSponsors(
    sponsor: any,
    queryWords: string[],
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the speaker name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (sponsor.name.toLowerCase().indexOf(queryWord) > -1) {
          console.log(sponsor.name);
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // all tests must be true if it should not be hidden
    return matchesQueryText
  }

  getSpeakers(queryText: string) {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    return this.load().pipe(
      map((data: any) => {
        data.speakers.forEach((speaker: any) => {
          this.filterSpeaker(speaker, queryWords);
        });
        return data.speakers.sort((a: any, b: any) => {
          const aName = a.name.split(' ').pop();
          const bName = b.name.split(' ').pop();
          return aName.localeCompare(bName);
        });
      })
    );
  }

  filterSpeaker(
    speaker: any,
    queryWords: string[],
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the speaker name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (speaker.name.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // all tests must be true if it should not be hidden
    speaker.hide = !(matchesQueryText)
  }

  getTracks() {
    return this.load().pipe(
      map((data: any) => {
        return data.tracks.sort();
      })
    );
  }
}
