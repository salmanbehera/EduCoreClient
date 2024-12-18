import { Injectable } from '@angular/core';
import moment from 'moment'; // Optional: You can use moment.js or Angular's built-in DatePipe

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {

  // Format a date to a specific format
  formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    return moment(date).format(format); // using moment.js
  }

  // Check if a date is within a range
  isDateInRange(date: Date, start: Date, end: Date): boolean {
    return moment(date).isBetween(start, end, 'days', '[]'); // inclusive
  }

  // Add or subtract days from a date
  modifyDate(date: Date, days: number): Date {
    return moment(date).add(days, 'days').toDate();
  }

  // Compare two dates
  compareDates(date1: Date, date2: Date): number {
    return moment(date1).diff(moment(date2), 'days');
  }
}
