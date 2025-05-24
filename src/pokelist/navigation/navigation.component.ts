import {Component, computed, input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'pokelist-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  imports: [],
  standalone: true
})
export class NavigationComponent {
  currentPage = input<number>(1);
  previousPage = computed<number>(() => (+this.currentPage() - 1));
  nextPage = computed<number>(() => +this.currentPage() + 1);

  constructor(private router: Router) {
  }

  goToNextPage() {
    if (!this.nextPage)
      return;

    this.goToPage(this.nextPage());
  }

  goToPreviousPage() {
    if (!this.previousPage)
      return;

    this.goToPage(this.previousPage());
  }

  goToPage(page: any) {
    if(page.target?.value !== undefined)
      page = page.target.value;

    if(page === undefined || page === '' || page === this.currentPage())
      return;

    this.router.navigate(['/pokemons', {'page': page}]);
  }
}
