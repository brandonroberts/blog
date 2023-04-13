import { Pipe, PipeTransform } from '@angular/core';

import readingTime from 'reading-time';

@Pipe({
  name: 'readingtime',
  standalone: true,
})
export class ReadingTimePipe implements PipeTransform {
  transform(content: string | undefined): number {
    return content ? Math.round(readingTime(content).minutes) : 0;
  }
}
