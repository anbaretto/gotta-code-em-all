import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PokelistComponent} from './pokelist.component';
import {ActivatedRoute} from '@angular/router';

describe('PokelistComponent', () => {
  let component: PokelistComponent;
  let fixture: ComponentFixture<PokelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: ActivatedRoute, useValue: {snapshot: {params: {}}}
      }],
      imports: [PokelistComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PokelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have 10 pokemons`, async () => {
    component.page = 2; //easter egg hacks first page :)
    await component.loadContent();
    expect(component.pokemons?.length).toEqual(10);
  });

  it('should render an image for each pokemon', async () => {
    await component.loadContent();

    fixture.detectChanges();

    const htmlElement = fixture.nativeElement as HTMLElement;
    const imageCount = htmlElement.querySelectorAll('img').length;
    const pokemonCount = component.pokemons?.length ?? 0;

    expect(imageCount).toEqual(pokemonCount);
  });

  it('should render each pokemons name', async () => {
    await component.loadContent();

    fixture.detectChanges();

    const htmlElement = fixture.nativeElement as HTMLElement;
    const pokemonNameContainers = htmlElement.querySelectorAll('.poke-name-container a');
    const pokemonAmount = component.pokemons?.length ?? 0;

    expect(pokemonNameContainers.length).toEqual(pokemonAmount);

    for (let i = 0; i < pokemonAmount; i++) {
      const pokemonName = component.pokemons?.[i]?.name.toLowerCase() ?? '';
      const renderedName = pokemonNameContainers.item(i)?.textContent?.toLowerCase() ?? '';
      expect(renderedName).toEqual(pokemonName);
    }
  });
});
