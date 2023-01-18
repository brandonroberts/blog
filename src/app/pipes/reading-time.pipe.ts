import { Pipe, PipeTransform } from '@angular/core';

import readingTime from 'reading-time';

@Pipe({
  name: 'readingtime',
  standalone: true,
})
export class ReadingTimePipe implements PipeTransform {
  transform(content: string): number {
    return Math.round(readingTime(content).minutes);
  }
}
