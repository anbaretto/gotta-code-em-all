import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'pokeId'
})
export class PokemonIdPipePipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().padStart(4, '0');
  }
}
