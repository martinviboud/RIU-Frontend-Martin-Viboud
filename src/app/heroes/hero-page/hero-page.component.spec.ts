import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { HeroPageComponent } from './hero-page.component';
import { HeroesService } from '../services/heroes.service';
import { of } from 'rxjs';
import { Gender, Hero } from '../interfaces/hero.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListPageComponent } from '../list-page/list-page.component';

describe('HeroPageComponent', () => {
  let component: HeroPageComponent;
  let fixture: ComponentFixture<HeroPageComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let heroesServiceMock: jasmine.SpyObj<HeroesService>;
  let routerMock: Router;
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

  mockActivatedRoute = {
    params: of({ id: '1' }),
  };
  

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    heroesServiceMock = jasmine.createSpyObj<HeroesService>('HeroesService', ['getHeroById']);
    TestBed.configureTestingModule({
      providers: [{ provide: HeroesService, useValue: heroesServiceMock },
                  { provide: ActivatedRoute, useValue: mockActivatedRoute },
                  { provide: Router, useVale: routerMock }],
      imports: [HeroPageComponent, RouterTestingModule.withRoutes(
        [{path: 'layout/list', component: ListPageComponent}]
      ), MaterialModule]
    });
    fixture = TestBed.createComponent(HeroPageComponent);
    component = fixture.componentInstance;
    routerMock = TestBed.inject(Router);
    
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el valor de isLoading del servicio', () => {
    
    expect(component.isLoading).toBe(heroesServiceMock.isLoading);
  });

  it('debería cargar el héroe correcto al inicializarse', () => {

    heroesServiceMock.getHeroById.and.returnValue(of(mockHero));
    

    component.ngOnInit();

    expect(heroesServiceMock.getHeroById).toHaveBeenCalledWith('1');
    expect(component.hero).toEqual(mockHero);
  });

  it('debería llamar al método navigateByUrl() del Router con el método goBack()', () => {
    spyOn(routerMock, 'navigateByUrl');
    
    component.goBack();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/layout/list');
  });

  it('debería redirigir al listado si no se encuentra el héroe', () => {
    spyOn(routerMock, 'navigate');
    heroesServiceMock.getHeroById.and.returnValue(of(undefined));

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/layout/list']);
  });
});
