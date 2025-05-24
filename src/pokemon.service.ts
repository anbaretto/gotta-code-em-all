import {inject, Injectable} from '@angular/core';
import {EasterEggService} from './easter-egg.service';

class ApiUrls {
  private static readonly RootUrl = 'https://pokeapi.co/api/v2/';

  public static PokemonList(offset: number, pageLimit: number) {
    return ApiUrls.RootUrl + 'pokemon?offset=' + offset + '&limit=' + pageLimit + '/';
  }

  public static Pokemon = ApiUrls.RootUrl + 'pokemon/';
  public static PokemonSpecies = ApiUrls.RootUrl + 'pokemon-species/';
  public static EvolutionChain = ApiUrls.RootUrl + 'evolution-chain/';
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  cached_queries: Map<string, string> = new Map<string, string>();
  page_limit = 10;
  easterEggService = inject(EasterEggService);

  async getListForPage(page: number): Promise<Pokemon[]> {
    const offset = (page - 1) * this.page_limit;
    let pokemons = await this.getListFromOffset(offset);

    if (page == this.easterEggService.targetPage) {
      pokemons.unshift(this.easterEggService.getEasterEgg());
    }

    return pokemons;
  }

  async getPokemon(pokemonName: string): Promise<Pokemon> {
    if (pokemonName == this.easterEggService.secretName) {
      return this.easterEggService.getEasterEgg();
    }
    const getPokemonUrl = ApiUrls.Pokemon + pokemonName;
    const content = await this.getContent<ApiPokemonContent>(getPokemonUrl);
    const evolutions = await this.getPokemonEvolutions(content);
    return Pokemon.fromPokemonContent(content, evolutions);
  }

  private async getListFromOffset(offset: number): Promise<Pokemon[]> {
    const url = ApiUrls.PokemonList(offset, this.page_limit);
    const pokemonList = await this.getContent<ApiPokemonList>(url);
    return this.listItemsToPokemons(pokemonList);
  }

  private listItemsToPokemons(pokemonList: ApiPokemonList): Promise<Pokemon[]> {
    const pokemonPromises = pokemonList.results
      .map(item => this.getPokemon(item.name));
    return Promise.all(pokemonPromises);
  }

  private async getPokemonEvolutions(pokemon: ApiPokemonContent): Promise<Pokemon[]> {
    const pokemonSpeciesUrl = ApiUrls.PokemonSpecies + pokemon.name
    const species = await this.getContent<ApiPokemonSpecies>(pokemonSpeciesUrl)
    const evolutionChain = await this.getContent<ApiEvolutionChain>(species.evolution_chain.url)
    const directSpecies = this.getDirectEvolutionsForPokemon(pokemon.name, Array.of(evolutionChain.chain));
    return Promise.all(directSpecies.map(s => this.getPokemon(s.name)));
  }

  private getDirectEvolutionsForPokemon(pokemonName: string, chainLinks: ApiEvolutionChainLink[]): ApiSpecies[] {
    if (!chainLinks || chainLinks.length == 0)
      return [];

    let nextChains: ApiEvolutionChainLink[] = [];
    for (let i = 0; i < chainLinks.length; i++) {
      const chainLink = chainLinks[i];
      if (chainLink.species.name == pokemonName) {
        return chainLink.evolves_to.map(e => e.species);
      } else {
        chainLink.evolves_to.map(e => nextChains.push(e));
      }
    }
    return this.getDirectEvolutionsForPokemon(pokemonName, nextChains);
  }

  private async getContent<P>(url: string): Promise<P> {
    const response = await fetch(url);
    const responseJson = await response.json();
    const content = JSON.stringify(responseJson);
    this.cached_queries.set(url, content);
    return JSON.parse(content);
  }
}

//#region ApiTypes

type ApiPokemonList = {
  results: [{
    name: string;
    url: string;
  }]
}
type ApiPokemonContent = {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  }
  abilities: ApiPokemonAbility[]
  species: {
    name: string;
  }
  types: ApiType[]
}
type ApiType = {
  type: {
    name: string
  }
}
type ApiPokemonAbility = {
  ability: {
    name: string;
  },
  is_hidden: boolean;
}
type ApiEvolutionChain = {
  id: number;
  chain: ApiEvolutionChainLink
}
type ApiEvolutionChainLink = {
  species: ApiSpecies;
  evolves_to: ApiEvolutionChainLink[];
}
type ApiPokemonSpecies = {
  flavor_text_entries: [
    {
      flavor_text: string;
    }
  ]
  evolution_chain: {
    id: number;
    name: string;
    url: string;
  }
}
type ApiSpecies = {
  name: string;
  url: string;
}

//#endregion

export class Pokemon {
  id: number;
  name: string;
  spriteUrl: string;
  abilities: PokemonAbility[];
  types: string[];
  evolutions: Pokemon[] | undefined;

  constructor(id: number, name: string, spriteUrl: string, abilities: PokemonAbility[], types: string[], evolutions: Pokemon[]) {
    this.id = id;
    this.name = name;
    this.spriteUrl = spriteUrl;
    this.abilities = abilities;
    this.types = types;
    this.evolutions = evolutions;
  }

  static fromPokemonContent(content: ApiPokemonContent, evolutions: Pokemon[]) {
    return new Pokemon(
      content.id,
      content.name,
      content.sprites.other["official-artwork"].front_default,
      content.abilities.map(ability => {
        return <PokemonAbility>{
          name: ability.ability.name,
          is_hidden: ability.is_hidden,
        }
      }),
      content.types.map(t => t.type.name),
      evolutions);
  }
}

export type PokemonAbility = {
  name: string;
  is_hidden: boolean;
}
