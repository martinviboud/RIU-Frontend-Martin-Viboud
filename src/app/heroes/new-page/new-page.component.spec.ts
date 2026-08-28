import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPageComponent } from './new-page.component';
import { HeroesService } from '../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gender, Hero } from '../interfaces/hero.interface';
import { RouterTestingModule } from '@angular/router/testing';

describe('NewPageComponent', () => {
  let component: NewPageComponent;
  let fixture: ComponentFixture<NewPageComponent>;
  let heroesServiceMock: jasmine.SpyObj<HeroesService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let routerMock: Router;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  const mockFormValid = {
    id: null,
    name: 'Superman',
    gender: Gender.Male,
    publisher: 'DC Comics',
    fullName: 'Clark Kent',
    placeOfBirth: 'Krypton',
    intelligence: 100,
    strength: 100,
    speed: 100,
    durability: 100,
    power: 100,
    combat: 100,
    img: '/assets/superman.jpg',
  }

  const mockFormValidID = {
    id: 1,
    name: 'Superman',
    gender: Gender.Male,
    publisher: 'DC Comics',
    fullName: 'Clark Kent',
    placeOfBirth: 'Krypton',
    intelligence: 100,
    strength: 100,
    speed: 100,
    durability: 100,
    power: 100,
    combat: 100,
    img: '/assets/superman.jpg',
  }
  const mockFormInvalid = {
    id: null,
    name: '',
    gender: Gender.Male,
    publisher: 'DC Comics',
    fullName: 'Clark Kent',
    placeOfBirth: 'Krypton',
    intelligence: 100,
    strength: 100,
    speed: 100,
    durability: 100,
    power: 100,
    combat: 100,
    img: '/assets/superman.jpg',
  }

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
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    heroesServiceMock = jasmine.createSpyObj<HeroesService>('HeroesService', ['deleteHero', 'updateHero', 'getHeroById', 'newHero']);
    TestBed.configureTestingModule({
      providers: [{ provide: HeroesService, useValue: heroesServiceMock },
                  { provide: ActivatedRoute, useValue: mockActivatedRoute },
                  { provide: Router, useVale: routerMock },
                  { provide: MatSnackBar, useValue: snackBarMock },
                    FormBuilder],
      imports: [NewPageComponent, BrowserAnimationsModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(NewPageComponent);
    component = fixture.componentInstance;
    routerMock = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('No debería cargar un heroe si no esta presente "edit" en el URL', () => {
    spyOn(routerMock, 'navigateByUrl');
    spyOnProperty(routerMock, 'url').and.returnValue('new-hero'); 

    component.ngOnInit();

    expect(heroesServiceMock.getHeroById).not.toHaveBeenCalled();
  });
  it('Debería cargar un heroe si esta presente "edit" en el URL', () => {
    spyOn(routerMock, 'navigateByUrl');
    spyOnProperty(routerMock, 'url').and.returnValue('edit'); 
    heroesServiceMock.getHeroById.and.returnValue(of(mockHero));
    
    component.ngOnInit();

    expect(heroesServiceMock.getHeroById).toHaveBeenCalled();
  });

  it('Deberia cargar los datos del formulario con el héroe', () => {
    fixture.detectChanges();
    spyOn(routerMock, 'navigateByUrl');
    spyOnProperty(routerMock, 'url').and.returnValue('edit');    
    heroesServiceMock.getHeroById.and.returnValue(of(mockHero));
    mockActivatedRoute.params = of({ id: '1' });
 
    component.ngOnInit();
    
    expect(heroesServiceMock.getHeroById).toHaveBeenCalledWith('1');
    expect(component.heroForm.value).toEqual({
      id: mockHero.id,
      name: mockHero.name,
      gender: mockHero.appearance.gender,
      publisher: mockHero.biography.publisher ?? '',
      fullName: mockHero.biography.fullName,
      placeOfBirth: mockHero.biography.placeOfBirth,
      intelligence: mockHero.powerstats.intelligence,
      strength: mockHero.powerstats.strength,
      speed: mockHero.powerstats.speed,
      durability: mockHero.powerstats.durability,
      power: mockHero.powerstats.power,
      combat: mockHero.powerstats.combat,
      img: mockHero.images.md,
    });

        
  });

  it('debería cargar el formulario con publisher vacío si el héroe no tiene publisher', () => {
    fixture.detectChanges();
    spyOn(routerMock, 'navigateByUrl');
    spyOnProperty(routerMock, 'url').and.returnValue('edit');
    heroesServiceMock.getHeroById.and.returnValue(of({ ...mockHero, biography: { ...mockHero.biography, publisher: null } }));
    mockActivatedRoute.params = of({ id: '1' });

    component.ngOnInit();

    expect(component.heroForm.value.publisher).toBe('');
  });

  it('debería navegar a la raiz del proyecto si "edit" esta presente pero no encuentra ningun héroe con ese ID', () => {
      spyOnProperty(routerMock, 'url').and.returnValue('edit');
      mockActivatedRoute.params = of({ id: '2' });
      heroesServiceMock.getHeroById.and.returnValue(of(undefined));
      spyOn(routerMock, 'navigateByUrl').and.stub();
  
      component.ngOnInit();
  
      expect(heroesServiceMock.getHeroById).toHaveBeenCalledWith('2');
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });


  it('debería mostrar un mensaje de error si el formulario es inválido', () => {
    component.heroForm.setValue(mockFormInvalid);
    spyOn(routerMock, 'navigate');
    spyOn(component.heroForm, 'markAllAsTouched');
    fixture.detectChanges();
    component.onSubmit();

    expect(snackBarMock.open).toHaveBeenCalledWith('¡Por lo menos dale un nombre a tu heroe!', 'done', {
      duration: 3000,
    });
    expect(component.heroForm.markAllAsTouched).toHaveBeenCalled();
    expect(heroesServiceMock.newHero).not.toHaveBeenCalled();
    expect(heroesServiceMock.updateHero).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debería llamar a heroesService.newHero() si currentHero.id es falso', () => {
    component.heroForm.setValue(mockFormValid);
    spyOn(routerMock, 'navigate');
    heroesServiceMock.newHero.and.returnValue(of(mockHero));
    

    component.onSubmit();

    expect(heroesServiceMock.newHero).toHaveBeenCalledWith(component.currentHero);
    expect(routerMock.navigate).toHaveBeenCalledWith(['layout/list']);
    expect(snackBarMock.open).toHaveBeenCalledWith(`${mockHero.name} creado!`, 'done', { duration: 3000 });
    expect(heroesServiceMock.updateHero).not.toHaveBeenCalled();
  });

  it('debería llamar a heroesService.updateHero() si currentHero.id es verdadero', () => {
    component.heroForm.setValue(mockFormValidID);
    spyOn(routerMock, 'navigate');
    heroesServiceMock.updateHero.and.returnValue(of(mockHero));

    component.onSubmit();

    expect(heroesServiceMock.updateHero).toHaveBeenCalledWith(component.currentHero);
    expect(routerMock.navigate).toHaveBeenCalledWith(['layout/list']);
    expect(snackBarMock.open).toHaveBeenCalledWith(`${mockHero.name} actualizado!`, 'done', { duration: 3000 });
    expect(heroesServiceMock.newHero).not.toHaveBeenCalled();
  });

  it('debería llamar al método deleteHero() del servicio HeroesService con el héroe actual', () => {
    component.heroForm.setValue(mockFormValidID);

    component.deleteHero();

    expect(heroesServiceMock.deleteHero).toHaveBeenCalledWith(component.currentHero);
  });

  it('debería llamar al método open() del servicio SnackBar con los parámetros correctos', () => {
    const message = 'Mensaje de prueba';

    component.showSnackBar(message);

    expect(snackBarMock.open).toHaveBeenCalledWith(message, 'done', {
      duration: 3000,
    });
  });

  it('debería llamar al método navigateByUrl() del servicio Router con la ruta correcta', () => {
    spyOn(routerMock, 'navigateByUrl');
    
    component.goBack();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/layout/list');
  });
    
     
});





