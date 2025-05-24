import {Routes} from '@angular/router';
import {PokelistComponent} from '../pokelist/pokelist.component';
import {PokedetailsComponent} from '../pokedetails/pokedetails.component';

export const routes: Routes = [
  {
    path: 'pokemons/:id',
    title: 'Pokemon details',
    component: PokedetailsComponent
  },
  {
    path: 'pokemons',
    title: 'Pokemons',
    component: PokelistComponent
  },
  {
    path: '',
    redirectTo: 'pokemons',
    pathMatch: 'full',
  }
];
