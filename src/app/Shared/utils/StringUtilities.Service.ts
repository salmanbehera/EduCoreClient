import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtilsService {

  // Capitalize the first letter of a string
  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Truncate a string to a specific length with ellipsis
  truncateString(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Convert a string to slug (useful for URLs)
  stringToSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  // Check if a string is empty or contains only whitespace
  isEmptyOrWhitespace(text: string): boolean {
    return !text || text.trim().length === 0;
  }
}
