import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${this.getLabel(key, interval)} ago`;
      }
    }

    return 'just now';
  }

  private getLabel(unit: string, value: number): string {
    const pluralLabels: { [key: string]: string } = {
      year: 'years',
      month: 'months',
      week: 'weeks',
      day: 'days',
      hour: 'hours',
      minute: 'minutes',
    };

    const singularLabels: { [key: string]: string } = {
      year: 'year',
      month: 'month',
      week: 'week',
      day: 'day',
      hour: 'hour',
      minute: 'minute',
    };

    return value === 1 ? singularLabels[unit] : pluralLabels[unit];
  }

}
