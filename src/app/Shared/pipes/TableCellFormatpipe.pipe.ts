import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

@Pipe({
  name: 'TableCellFormat',
  standalone: true
})
export class TableCellFormatpipe implements PipeTransform {
//   constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private decimalPipe: DecimalPipe) {}

//   transform(value: any, type: string, format: string = 'defaultFormat', additionalParam?: any): any {
//     if (value == null) return ''; // Return empty if value is null

//     // If format is undefined or null, use 'defaultFormat'
//     format = format ?? 'defaultFormat';

//     switch (type) {
//       case 'date':
//         return this.datePipe.transform(value, format); // Format as date
//       case 'currency':
//         return this.currencyPipe.transform(value, 'INR', 'symbol', '1.0-0'); // Format as currency (INR)
//       case 'number':
//         return this.decimalPipe.transform(value, '1.0-2'); // Format as number with 2 decimal places
//       case 'boolean':
//         return value ? 'Yes' : 'No'; // Convert boolean to Yes/No
//       case 'capitalize':
//         if (typeof value === 'string') {
//           return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); // Capitalize first letter
//         }
//         return value;
//       case 'truncate':
//         if (typeof value === 'string' && typeof additionalParam === 'number') {
//           return value.length > additionalParam ? value.substring(0, additionalParam) + '...' : value; // Truncate string
//         }
//         return value;
//       default:
//         return value; // Return value unchanged if no matching type
//     }
//   }
// }

transform(value: any, format: string= 'defaultFormat', ...args: any[]): string | null {
  if (!value) {
    return null;
  }
// Fallback for undefined format
const formatType = format || 'defaultFormat';
  switch (formatType) {
    case 'date':
      return this.formatDate(value, args[0]); // args[0] can be the date format
    case 'currency':
      return this.formatCurrency(value, args[0] || 'INR'); // args[0] is currency code
    case 'truncate':
      return this.truncate(value, args[0] || 30); // args[0] is max length
    default:
      return value.toString();
  }
}

private formatDate(value: string | Date, format: string): string {
  const date = new Date(value);
  const options: Intl.DateTimeFormatOptions = this.getDateFormatOptions(format);
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

private getDateFormatOptions(format: string): Intl.DateTimeFormatOptions {
  switch (format) {
    case 'short':
      return { year: 'numeric', month: 'short', day: 'numeric' };
    case 'medium':
      return { year: 'numeric', month: 'long', day: 'numeric' };
    case 'long':
      return { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    default:
      return { year: 'numeric', month: 'numeric', day: 'numeric' };
  }
}

private formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2
  }).format(value);
}

private truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
}
}
