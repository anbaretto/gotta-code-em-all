import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavigationComponent} from './navigation.component';
import {ActivatedRoute, Router} from '@angular/router';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{
        provide: ActivatedRoute, useValue: {snapshot: {params: {}}}
      }],
      imports: [NavigationComponent]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have disabled the PreviousPage button at the first page', async () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    spyOn(component, 'goToPreviousPage');

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBeTrue();
    expect(component.goToPreviousPage).toHaveBeenCalledTimes(0);
  });

  it('should invoke goToPreviousPage() when pressing the PreviousPageButton', async () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    spyOn(component, 'goToPreviousPage');

    const button = fixture.nativeElement.querySelector('.navigation .previous') as HTMLButtonElement;

    button.click();

    expect(component.goToPreviousPage).toHaveBeenCalled();
  });

  it('should invoke goToNextPage() when pressing the NextPageButton', async () => {
    spyOn(component, 'goToNextPage');

    const button = fixture.nativeElement.querySelector('.navigation .next') as HTMLButtonElement;

    button.click();

    expect(component.goToNextPage).toHaveBeenCalled();
  });

  it('should move to correct page when invoking goToNextPage()', async () => {
    spyOn(router, 'navigate');

    const nextPage = component.nextPage();
    component.goToNextPage();

    expect(router.navigate).toHaveBeenCalledWith(['/pokemons', {page: nextPage}]);
  });

  it('should route to correct page when invoking goToPreviousPage()', async () => {
    spyOn(router, 'navigate');

    const previousPage = component.previousPage();
    component.goToPreviousPage();

    expect(router.navigate).toHaveBeenCalledWith(['/pokemons', {page: previousPage}]);
  });
});
