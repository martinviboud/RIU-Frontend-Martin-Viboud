import { HeroesService } from './heroes.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Gender, Hero } from '../interfaces/hero.interface';
import { MaterialModule } from 'src/app/material/material.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  let dialog: MatDialog;
  let snackBar: MatSnackBar;
  let router: Router;


  const mockHeroes: Hero[] = [ {
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
  },
  {
    "id": 2,
    "name": "Abe Sapien",
    "powerstats": {
      "intelligence": 88,
      "strength": 28,
      "speed": 35,
      "durability": 65,
      "power": 100,
      "combat": 85
    },
    "appearance": {
      "gender": Gender.Male
    },
    "biography": {
      "fullName": "Abraham Sapien",
      "alterEgos": "No alter egos found.",
      "placeOfBirth": "-",
      "publisher": "Dark Horse Comics",
    },
    "images": { 
      "md": "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/2-abe-sapien.jpg"   
    }
  }];
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
    imports: [MaterialModule],
    providers: [HeroesService,
        { provide: MatDialog, useValue: { open: () => { } } },
        { provide: MatSnackBar, useValue: { open: () => { } } },
        { provide: Router, useValue: { navigate: () => { } } }, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debería traer a todos los heroes', () => {
    
    service.getHeroes().subscribe(heroes => {
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('debería traer un solo heroe por id', () => {
    const heroId = '1';

    service.getHeroById(heroId).subscribe(hero => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
  });

  it('debería traer un heroe que coincida con el query en su nombre', () => {
    const testData: Hero[] = [ mockHero ];
    const query = 'bomb';

    service.searchHero(query).subscribe((heroes: Hero[]) => {
      expect(heroes).toEqual(testData);
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes?name_like=${query}&_limit=10`);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('debería crear un nuevo héroe', () => {
    const newHero: Hero = mockHero;

    service.newHero(newHero).subscribe((createdHero: Hero) => {
      expect(createdHero).toEqual(newHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newHero); 
    req.flush(newHero);
  });

  it('debería actualizar un nuevo héroe', () => {
    const updatedHero: Hero = mockHero;

    service.updateHero(updatedHero).subscribe((result: Hero) => {
      expect(result).toEqual(updatedHero);
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${updatedHero.id}`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual(updatedHero); 
    req.flush(updatedHero); 
  });

  it('debería eliminar un héroe y mostrar el banner de confirmación', fakeAsync(() => {
    
    const dialogRef = { afterClosed: () => of(true) }; 
    const confirmDeleteResult = of(true); 

    
    spyOn(dialog, 'open').and.returnValue(dialogRef as MatDialogRef<ConfirmDialogComponent>);
    spyOn(service, 'confirmDelete').and.returnValue(confirmDeleteResult);

    spyOn(snackBar, 'open');
    spyOn(router, 'navigate');
    
    service.deleteHero(mockHero);
    tick();
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, { data: mockHero });

    expect(service.confirmDelete).toHaveBeenCalledWith(mockHero.id);
    expect(snackBar.open).toHaveBeenCalledWith('Superheroe eliminado con éxito', 'done', { duration: 3000 });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  }));

  it('no deberia borrar ningun heroe si el banner se cierra', fakeAsync(() => {
    
    const dialogRef = { afterClosed: () => of(false) };

    spyOn(dialog, 'open').and.returnValue(dialogRef as MatDialogRef<ConfirmDialogComponent>);

    spyOn(service, 'confirmDelete');
    spyOn(snackBar, 'open');
    spyOn(router, 'navigate');

    service.deleteHero(mockHero);

    tick();
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, { data: mockHero });
    expect(service.confirmDelete).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('deberia eliminar un heroe y devolver true', () => {
    const heroId = 1;

    service.confirmDelete(heroId).subscribe((result: boolean) => {
      expect(result).toBeTrue();
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('debería devolver falso si da error', () => {
    const heroId = 1;

    service.confirmDelete(heroId).subscribe((result: boolean) => {
      expect(result).toBeFalsy();
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('debería traer los héroes paginados cuando se pasan page y limit', () => {
    service.getHeroes(2, 5).subscribe(heroes => {
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes?_page=2&_limit=5');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('debería lanzar un error si se intenta actualizar un héroe sin id', () => {
    const heroSinId = { ...mockHero, id: undefined as any };

    expect(() => service.updateHero(heroSinId)).toThrowError('ID is required');
  });

  it('debería devolver undefined si getHeroById falla', () => {
    const heroId = '1';

    service.getHeroById(heroId).subscribe(hero => {
      expect(hero).toBeUndefined();
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });
});
