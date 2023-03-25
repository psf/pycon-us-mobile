import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserData } from './user-data';

@Injectable({
  providedIn: 'root'
})
export class ConferenceData {
  data: any;

  constructor(public http: HttpClient, public user: UserData) {}

  load(): any {
    if (this.data) {
      return of(this.data);
    } else {
      return this.http
        .get('https://us.pycon.org/2023/schedule/conference.json')
        .pipe(map(this.processData, this));
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = {
      "schedule": [],
      "speakers": []
    };

    data.schedule.forEach((slot: any) => {
      if (["break", "blank"].includes(slot.kind)) {
        return;
      }
      if (slot.kind == "plenary") {
        slot.room = "Main Stage"
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
              "profilePic": speaker.photo,
              "about": speaker.bio,
            });
          }
        });
      }

      var start = new Date(slot.start);
      var end = new Date(slot.end);
      var session = {
          "name": slot.name,
          "location": slot.room,
          "description": slot.description,
          "speakers": [],
          "speakerNames": slot.authors,
          "timeStart": start.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}).toLowerCase(),
          "timeEnd": end.toLocaleString([], {hour: 'numeric', minute:'2-digit'}).toLowerCase(),
          "track": slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1),
          "tracks": [slot.kind.charAt(0).toUpperCase() + slot.kind.slice(1)],
          "id": slot.conf_key
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

      var day = start.toISOString().split('T')[0];
      var group = start.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}).toLowerCase();

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
            scheduleDay.groups.push({"time": group, "sessions": [session]})
        }
      } else {
        this.data.schedule.push({"date": day, "groups": [{"time": group, "sessions": [session]}]})
      }

    });

    console.log(this.data);
    return this.data;
  }

  getTimeline(
    dayIndex: number,
    queryText = '',
    excludeTracks: any[] = [],
    segment = 'all'
  ) {
    return this.load().pipe(
      map((data: any) => {
        const day = data.schedule[dayIndex];
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
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.name)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().pipe(
      map((data: any) => {
        return data.speakers.sort((a: any, b: any) => {
          const aName = a.name.split(' ').pop();
          const bName = b.name.split(' ').pop();
          return aName.localeCompare(bName);
        });
      })
    );
  }

  getTracks() {
    return this.load().pipe(
      map((data: any) => {
        return data.tracks.sort();
      })
    );
  }

  getMap() {
    return this.load().pipe(
      map((data: any) => {
        return data.map;
      })
    );
  }
}
