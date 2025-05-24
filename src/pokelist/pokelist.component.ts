import {Component, Input} from '@angular/core';
import {PokemonService, Pokemon} from '../pokemon.service';
import {RouterLink} from '@angular/router';
import {NgIf, TitleCasePipe} from '@angular/common';
import {PokemonIdPipePipe} from '../pokemon-id-format-pipe';
import {NavigationComponent} from './navigation/navigation.component';

@Component({
  selector: 'pokelist',
  templateUrl: './pokelist.component.html',
  styleUrl: './pokelist.component.css',
  imports: [
    RouterLink,
    TitleCasePipe,
    PokemonIdPipePipe,
    NavigationComponent,
    NgIf
  ],
  standalone: true
})
export class PokelistComponent {
  pokemons: Pokemon[] | undefined;
  pageIndex: number = 1;
  isLoading = true;

  constructor(
    private pokemonService: PokemonService) {
  }

  @Input()
  set page(page: number | undefined) {
    this.pageIndex = page ?? 1;
    this.loadContent();
  }

  async loadContent() {
    this.isLoading = true;
    this.pokemons = await this.pokemonService.getListForPage(this.pageIndex)
    this.isLoading = false;
  }
}
