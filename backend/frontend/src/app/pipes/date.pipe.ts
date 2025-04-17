import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: string | Date): string {
    const todayDate = new Date();
    const createdDate = new Date(value);

    const isSameDate =
      todayDate.getFullYear() === createdDate.getFullYear() &&
      todayDate.getMonth() === createdDate.getMonth() &&
      todayDate.getDate() === createdDate.getDate();

    if (isSameDate) {
      return "Today";
    } else if (createdDate.getDate() + 1 == todayDate.getDate()) {
      return "Yesterday";
    }
    else {
      return `${createdDate.getDay()} ${createdDate.toLocaleString('default', { month: 'long' })} ${createdDate.getFullYear()}`;
    }
  }

}
