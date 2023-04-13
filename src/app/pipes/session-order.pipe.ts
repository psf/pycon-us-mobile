import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sessionOrder'
})
export class SessionOrderPipe implements PipeTransform {

  transform(value: any[]): any[] {
    return value.sort((session1, session2) => {
      return (session1.track < session2.track) ? -1 : (session1.track > session2.track) ? 1 : 0;
    });
  }

}
