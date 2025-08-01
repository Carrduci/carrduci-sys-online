import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callfunction',
  standalone: true
})
export class CallfunctionPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    return value(...args);
  }

}
