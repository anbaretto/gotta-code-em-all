import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokedetailsComponent } from './pokedetails.component';
import {AppComponent} from '../app/app.component';

describe('PokedetailsComponent', () => {
  let component: PokedetailsComponent;
  let fixture: ComponentFixture<PokedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
