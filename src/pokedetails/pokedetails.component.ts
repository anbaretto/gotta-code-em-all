import {Component, Input} from '@angular/core';
import {Pokemon, PokemonService} from '../pokemon.service';
import {NgIf, TitleCasePipe} from '@angular/common';
import {RemoveHyphensPipe} from '../remove-hyphens-pipe';
import {RouterLink} from '@angular/router';
import {PokemonIdPipePipe} from '../pokemon-id-format-pipe';

@Component({
  selector: 'app-pokedetails',
  imports: [NgIf, TitleCasePipe, RemoveHyphensPipe, RouterLink, PokemonIdPipePipe],
  templateUrl: './pokedetails.component.html',
  styleUrl: './pokedetails.component.css'
})
export class PokedetailsComponent {
  pokemon: Pokemon | undefined;

  constructor(private pokemonService: PokemonService) {
  }

  @Input()
  set id(pokemonName: string) {
    this.pokemonService
      .getPokemon(pokemonName)
      .then(pokemon => {
        this.pokemon = pokemon;
      });
  }
}
