import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe',
  standalone: true
})
export class TimePipePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (typeof value === 'string' && value.includes(',')) {
      value = value.replace(',', 'T');
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${hour12}:${paddedMinutes} ${ampm}`;
  }
}
