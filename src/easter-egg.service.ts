import {Injectable} from '@angular/core';
import {Pokemon} from './pokemon.service';

@Injectable({
  providedIn: 'root',
})
export class EasterEggService {
  readonly targetPage = 1;
  readonly secretName = "Gridra";

  getEasterEgg(): Pokemon {
    return new Pokemon(
      0,
      'Gridra',
      '/gotta-code-em-all/bannerflow-pokemon-by-raissa-hofmann_2025-05-20.png',
      [
        {name: 'Skill Link', is_hidden: false},
        {name: 'Compound Eyes', is_hidden: false},
        {name: 'Super Luck', is_hidden: true},
      ],
      ['Psychic'],
      []
    );
  }
}
