import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'removeHyphens'
})
export class RemoveHyphensPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/-/g, ' ') : value;
  }
}
