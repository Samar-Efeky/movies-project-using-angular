import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true // This makes the pipe usable without declaring it in an NgModule
})
export class TimeAgoPipe implements PipeTransform {
  
  // Transform method: converts a date/time value into a "time ago" string
  transform(value: string | Date): string {
    // Convert input value to Date object
    const date = new Date(value);
    const now = new Date();

    // Calculate difference in seconds
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Time intervals in seconds for different units
    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    // Loop through each time unit to find the largest matching interval
    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        // Return the formatted "time ago" string
        return `${interval} ${this.getLabel(key, interval)} ago`;
      }
    }

    // If less than a minute, return "just now"
    return 'just now';
  }

  // Returns correct singular or plural label for a time unit
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

    // Return singular if value is 1, otherwise plural
    return value === 1 ? singularLabels[unit] : pluralLabels[unit];
  }
}
