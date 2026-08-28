import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCardComponent } from './hero-card.component';
import { Gender, Hero } from '../interfaces/hero.interface';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';


describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;
  const mockHero: Hero = {
    "id": 1,
    "name": "A-Bomb",
    "powerstats": {
      "intelligence": 38,
      "strength": 100,
      "speed": 17,
      "durability": 80,
      "power": 24,
      "combat": 64
    },
    "appearance": {
      "gender": Gender.Male
    },
    "biography": {
      "fullName": "Richard Milhouse Jones",
      "alterEgos": "No alter egos found.",
      "placeOfBirth": "Scarsdale, Arizona",
      "publisher": "Marvel Comics"
    },
    "images": { 
      "md": "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/1-a-bomb.jpg"     
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeroCardComponent, MaterialModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hero', mockHero);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia emitir el evento delete con el héroe actual cuando se llama a deleteHero()', () => {

    spyOn(component.delete, 'emit');

    component.deleteHero();

    expect(component.delete.emit).toHaveBeenCalledWith(component.hero());
  });

  it('debería navegar al héroe correcto cuando se llama a navigateToHero()', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    component.navigateToHero();

    expect(router.navigateByUrl).toHaveBeenCalledWith(`/layout/${component.hero().id}`);
  });
});
